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

server.get('/teams/:team/artifacts/:artifact/tags/:tag/scm-source', function(req, res) {
    setTimeout(function() {
        if (req.params.team === 'stups' &&
            req.params.artifact === 'kio' &&
            req.params.tag === '1') {
            return res
                    .status(200)
                    .type('json')
                    .send(scmSource);
        }
        res.status(404).send();
    }, Math.random() * 2000);
});

server.get('/v1/search', function(req,res) {
    res
        .type('json')
        .status(200)
        .send({
            results: images
        });
});

module.exports = server;