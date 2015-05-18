var express = require('express'),
    server = express();


/** enable cors */
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

server.get('/v1/search', function(req,res) {
    res.status(200).send();
});

module.exports = server;