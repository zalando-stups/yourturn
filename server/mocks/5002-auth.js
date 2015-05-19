var express = require('express'),
    querystring = require('querystring'),
    uuid = require('node-uuid'),
    server = express();

/** enable cors */
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorize');
    next();
});

server.get('/auth', function(req,res) {
    setTimeout( function() {
        var error, success;
        if (!req.query.response_type || !req.query.client_id) {
            error = { error: 'invalid_request', state: req.query.state };
        }
        else if (req.query.client_id !== 'stups_yourturn' ) {
            error = { error: 'access_denied', state: req.query.state };
        }
        else {
            success = {
                access_token: uuid.v4(),
                token_type: 'access',
                expires_in: 60,
                state: req.query.state
            };
        }
        res.redirect(301, req.query.redirect_uri + '#' + querystring.stringify(success || error));    
    }, Math.random() * 2000);
});

module.exports = server;