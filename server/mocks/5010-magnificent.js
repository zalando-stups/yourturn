var express = require('express'),
    bodyParser = require('body-parser'),
    server = express();

server.use(bodyParser.json());


/** enable cors */
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});


server.get('/auth', function(req, res) {
    res.status(200).json('OK');
});

server.post('/auth', function(req, res) {
    res.status(200).json('OK');
});

module.exports = server;
