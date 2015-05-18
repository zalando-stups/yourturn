var express = require('express'),
    server = express(),
    request = require('superagent'),
    fs = require('fs'),
    index = process.env.ENV_TEST ? '' : fs.readFileSync('./index.html');

server.use('/dist', express.static('dist'));

/** enable cors */
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

function generateEnv() {
    var env = '';
    for( key in process.env ) {
        if (process.env.hasOwnProperty(key)) {
            if (key.indexOf( 'YTENV_' ) === 0 ) {
                env += '' + key + '="' + process.env[key] + '";\n';
            }
        }
    }
    return env;
}

function writeEnv() {
    var env = generateEnv();
    console.log('Current working directory', process.cwd());
    console.log('Current user id', process.getuid());
    fs.writeFileSync('dist/env.js', env );
}
if (!process.env.ENV_TEST) {
    writeEnv();
    setInterval( writeEnv, 1000 * 60 * 30 ); // write this every 30 minutes
}

server.get('/teams', function(req, res) {
    request
        .get(process.env.YTENV_TEAM_BASE_URL + '/teams')
        .accept('json')
        // take OAuth token from request
        .set('Authorization', req.get('Authorization'))
        .end(function(err, response) {
            if (err) {
                console.log(err);
                return res.status(err.status).send(err);
            }
            return res
                    .status(200)
                    .type('json')
                    .send(response.text);
        });
});

server.get('/user/:userId', function(req, res) {
    request
        .get(process.env.YTENV_TEAM_BASE_URL + '/user/' + req.params.userId)
        .accept('json')
        .set('Authorization', req.get('Authorization'))
        .end(function(err, response) {
            if (err) {
                console.log(err);
                return res.status(err.status).send(err);
            }
            return res
                    .status(200)
                    .type('json')
                    .send(response.text);
        });
});

server.get('/tokeninfo', function(req, res) {
    console.log('requested tokeninfo');
    request
        .get(process.env.YTENV_OAUTH_TOKENINFO_URL)
        .accept('json')
        .query({
            access_token: req.query.access_token
        })
        .end(function(err, response) {
            if (err) {
                console.log(err);
                return res.status(err.status).send(err);
            }
            return res
                    .status(200)
                    .type('json')
                    .send(response.text);
        });
});

server.get('/*', function(req, res) {
    res
        .append('Content-Type', 'text/html')
        .status(200)
        .send(index);
});

server.listen(8080);