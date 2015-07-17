/* global require, process */
var fs = require('fs'),
    winston = require('winston'),
    camel = require('camel-case'),
    xml2js = require('xml2js').parseString;

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
    timestamp: true,
    showLevel: true
});

// NEW RELIC
// has to be first require!
if (process.env.NEW_RELIC_APP_NAME) {
    require('newrelic');
} else if (process.env.YTENV_USE_APPDYNAMICS) {
// OR, YOU KNOW, APP DYNAMICS
    var xmlFile;
    try {
        xmlFile = String(fs.readFileSync('/agents/appdynamics-jvm/conf/controller-info.xml'));
    } catch(err) {
        winston.error('Could not read appdynamics config XML.', err.message);
    }
    xml2js(xmlFile, function(err, result) {
        if (err) {
            winston.error('Could not parse appdynamics config XML. Error: %s. Content: %s.', err.message, xmlFile);
            return;
        }
        result = result['controller-info'];
        var config = Object
                        .keys(result)
                        .map(function(key) {
                            return [camel(key), result[key][0]];
                        })
                        .reduce(function(prev, cur) {
                            var key = cur[0],
                                val = cur[1];
                            // convert string values
                            if (val === 'true') {
                                prev[key] = true;
                            } else if (val === 'false') {
                                prev[key] = false;
                            } else if (/^[0-9]+$/.test(val)) {
                                prev[key] = parseInt(val, 10);
                            } else {
                                prev[key] = val;
                            }
                            return prev;
                        }, {});
        winston.info('Using appdynamics config: %s:', JSON.stringify(config, null, 4));
        require('appdynamics').profile(config);
        winston.info('Successfully started appdynamics.');
    });
}

// THE REAL SHIT

var express = require('express'),
    compression = require('compression'),
    server = express(),
    request = require('superagent'),
    path = require('path'),
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

/**
 * Returns a JSON object with all the environment variables in it.
 *
 * @return {Object}
 */
function getEnvironment() {
    var env = {};
    for(key in process.env) {
        if (process.env.hasOwnProperty(key)) {
            if (key.indexOf( 'YTENV_' ) === 0 ) {
                env[key] = process.env[key];
            }
        }
    }
    // read client id from mint
    if (process.env.CREDENTIALS_DIR) {
        var clientJsonPath = path.join(process.env.CREDENTIALS_DIR, 'client.json'),
            clientJsonFile,
            clientJson;

        try {
            // try to read it
            clientJsonFile = fs.readFileSync(clientJsonPath);
        } catch(err) {
            winston.error('Could not read client.json: %s', err.message);
            return env;
        }

        try {
            // try to parse it as json
            clientJson = JSON.parse(clientJsonFile);
        } catch(err) {
            winston.error('Could not parse client.json: %s. Content: %s', err.message, clientJsonFile);
            return env;
        }
        // actually set it
        env['YTENV_OAUTH_CLIENT_ID'] = clientJson.client_id;
        winston.info('Successfully updated OAuth client credentials');
    }
    return env;
}

/**
 * Converts a JSON object into a JS script of global variables (trollface).
 *
 * @param  {Object} env The JSON object
 * @return {String} The script containing <KEY>="<VALUE>"; for every key in the object
 */
function convertToScript(env) {
    var script = '';
    for (key in env) {
        if (env.hasOwnProperty(key)) {
            script += key + '="' + env[key] + '";\n';
        }
    }
    return script;
}

/**
 * Gets the environment, converts it to a JS script and writes it to the disk.
 */
function writeEnv() {
    var env = getEnvironment();
    fs.writeFileSync('dist/env.js', convertToScript(env));
}

writeEnv();
setInterval(writeEnv, 1000 * 60 * 60); // write this every hour


// EXPRESS ROUTES BELOW

server.get('/teams', function(req, res) {
    request
        .get(process.env.YTENV_TEAM_BASE_URL + '/teams')
        .accept('json')
        // take OAuth token from request
        .set('Authorization', req.get('Authorization'))
        .end(function(err, response) {
            if (err) {
                winston.error('Could not GET /teams: %d %s', err.status || 0, err.message);
                return res.status(err.status || 0).send(err);
            }
            return res
                    .status(200)
                    .type('json')
                    .send(response.text);
        });
});

server.get('/users/:userId', function(req, res) {
    request
        .get(process.env.YTENV_USER_BASE_URL + '/employees/' + req.params.userId)
        .accept('json')
        .set('Authorization', req.get('Authorization'))
        .end(function(err, response) {
            if (err) {
                winston.error('Could not GET /employees/%s: %d %s', req.params.userId, err.status || 0, err.message);
                return res.status(err.status || 0).send(err);
            }
            return res
                    .status(200)
                    .type('json')
                    .send(response.text);
        });
});

server.get('/teams/:userId', function(req, res) {
    request
        .get(process.env.YTENV_TEAM_BASE_URL + '/user/' + req.params.userId)
        .accept('json')
        .set('Authorization', req.get('Authorization'))
        .end(function(err, response) {
            if (err) {
                winston.error('Could not GET /teams/%s: %d %s', req.params.userId, err.status || 0, err.message);
                return res.status(err.status || 0).send(err);
            }
            return res
                    .status(200)
                    .type('json')
                    .send(response.text);
        });
});

server.get('/tokeninfo', function(req, res) {
    request
        .get(process.env.YTENV_OAUTH_TOKENINFO_URL)
        .accept('json')
        .query({
            access_token: req.query.access_token
        })
        .end(function(err, response) {
            if (err) {
                if (err.status !== 400) {
                    // log error on tokeninfo only if it's not
                    // because of an invalid token
                    winston.error('Could not GET /tokeninfo: %d %s', err.status || 0, err.message);
                }
                return res.status(err.status || 0).send(err);
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
