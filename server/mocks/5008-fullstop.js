var express = require('express'),
    server = express(),
    fs = require('fs'),
    VIOLATIONS = fs.readFileSync(__dirname + '/fullstop-violations.json');

/** enable cors */
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

server.get('/violations', function(req, res) {
    setTimeout(function() {
        res
            .status(200)
            .type('json')
            .send(VIOLATIONS);
    }, Math.random() * 2000);
});



module.exports = server;