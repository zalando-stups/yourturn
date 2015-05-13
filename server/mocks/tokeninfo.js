var express = require('express'),
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

server.get('/tokeninfo', function(req,res) {
    if (!req.query.access_token) {
        return res.status(400).send();
    }
    tokeninfo.access_token = req.query.access_token;
    res.status(200).send(tokeninfo);
});

console.log('TOKENINFO 5006');
server.listen(5006);