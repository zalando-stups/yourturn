// set up logging
var IN_PROD = process.env.NODE_ENV === 'production',
    winston = require('winston');

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
    timestamp: () => (new Date()).toISOString(),
    showLevel: true,
    colorize: false,
    level:  IN_PROD ? 'info' : 'debug',
    formatter: IN_PROD ?
                opts => `${opts.level.toUpperCase()} ${opts.message || ''} ${opts.meta ? '[' + JSON.stringify(opts.meta) + ']' : ''}` :
                opts => `${opts.timestamp()} ${opts.level.toUpperCase()} ${opts.message || ''} ${opts.meta ? '[' + JSON.stringify(opts.meta) + ']' : ''}`
});

// set up 3rd party monitoring
// and set environment variables for browser
require('./monitoring/monitoring');
require('./monitoring/monitoring-client');
require('./env');

// this is the actual server code
var fs = require('fs'),
    express = require('express'),
    compression = require('compression'),
    moment = require('moment'),
    server = express(),
    routes = require('./routes/index'),
    oauth = require('./middleware/oauth'),
    uniqueLogins = require('./middleware/unique-logins'),
    redis = require('./redis'),
    stores = require('./data/stores/distinct'),
    metrics = require('./metrics'),
    index = fs.readFileSync('./index.html'),
    ONE_WEEK =  1000 *    // 1s
                  60 *    // 1m
                  60 *    // 1h
                  24 *    // 1d
                   7;     // 1w
server.use(compression());
server.use('/dist', express.static('dist', {
    maxAge: ONE_WEEK
}));

/** enable cors */
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

const inMemoryStore = stores.inMemoryStore({
    keyExpiration: moment.duration(1, 'day')
});
const redisStore = stores.redisStore({
    redis,
    key: 'unique-logins'
});
const store = stores.storeWithFallback(redisStore, inMemoryStore);
const report = metrics.report({
    providers: {
        'count.unique.logins': metrics.cachedProvider(() => store.size, 0),
        'count.inmemory.logins': metrics.cachedProvider(() => inMemoryStore.size, 0)
    }
});

// EXPRESS ROUTES BELOW
server.get('/accounts/?', routes.team.accounts);
server.get('/teams/?', routes.team.teams);
server.get('/teams/:teamId', routes.team.team);
server.get('/users/:userId', oauth, uniqueLogins(store), routes.user.detail);
server.get('/users/:userId/teams', routes.user.teams)
server.get('/users/:userId/accounts', routes.user.accounts);
server.get('/latestVersions/:team', routes.kio.latestVersions);
server.get('/tokeninfo', routes.tokeninfo.info);
server.get('/metrics', (req, res) => {
    report.generate().then(report => {
        res.json(report);
    });
});
// default route just responds with index.html
server.get('/*', function(req, res) {
    res
        .append('Content-Type', 'text/html')
        .status(200)
        .send(index);
});

server.listen(process.env.HTTP_PORT || 8080);
