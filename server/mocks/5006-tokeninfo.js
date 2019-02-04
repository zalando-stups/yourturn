var express = require('express'),
    bodyParser = require('body-parser'),
    server = express();

var tokeninfo = {
    "uid": "npiccolotto",
    "grant_type": "token",
    "scope": [
        "uid"
    ],
    "realm": "employees",
    "token_type": "Bearer",
    "expires_in": 3600
};

/** enable cors */
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});
server.use(bodyParser.json())


server.post('/tokeninfo', function(req,res) {
    if (!req.body.access_token) {
        return res.status(400).send();
    }
    tokeninfo.access_token = req.body.access_token;
    res.status(200).send(tokeninfo);
});

module.exports = server;