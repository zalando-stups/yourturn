// set up logging
var IN_PROD = process.env.NODE_ENV === 'production',
    winston = require('winston');

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
    timestamp: true,
    showLevel: true,
    colorize: IN_PROD ? false : true,
    level:  IN_PROD ? 'info' : 'debug'
});

// set up 3rd party monitoring
// and set environment variables for browser
require('./monitoring/monitoring');
require('./env');

// this is the actual server code
var fs = require('fs'),
    express = require('express'),
    compression = require('compression'),
    server = express(),
    routes = require('./routes/index'),
    oauth = require('./middleware/oauth'),
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

// EXPRESS ROUTES BELOW
server.get('/accounts/?', routes.team.accounts);
server.get('/teams/?', routes.team.teams);
server.get('/teams/:teamId', routes.team.team);
server.get('/latestVersions/:team', oauth, routes.kio.latestVersions);
server.get('/accounts/:userId', routes.user.accounts);
server.get('/users/:userId', routes.user.detail);
server.get('/tokeninfo', routes.tokeninfo.info);
// default route just responds with index.html
server.get('/*', function(req, res) {
    res
        .append('Content-Type', 'text/html')
        .status(200)
        .send(index);
});

server.listen(process.env.HTTP_PORT || 8080);
