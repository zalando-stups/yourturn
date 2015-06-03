var express = require('express'),
    server = express(),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    VIOLATIONS = JSON.parse(fs.readFileSync(__dirname + '/fullstop-violations.json'));

server.use(bodyParser.json());
/** enable cors */
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
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

server.get('/violations/:violationId', function(req, res) {
    var violationId = parseInt(req.params.violationId, 10),
        violation = VIOLATIONS
                        .filter(function(v) {
                            return v.id === violationId;
                        });
    if (!violation.length) {
        res.status(404).send();
        return;
    }
    res.status(200).type('json').send(violation[0]);
});

server.post('/violations/:violationId/resolve', function(req, res) {
    var violationId = parseInt(req.params.violationId, 10),
        violation = VIOLATIONS
                        .filter(function(v) {
                            return v.id === violationId;
                        });
    if (!violation.length) {
        res.status(404).send();
        return;
    }
    // remove old violation
    VIOLATIONS = VIOLATIONS
                    .filter(function(v) {
                        return v.id !== violationId;
                    });
    violation[0].lastModifiedBy = 'npiccolotto';
    violation[0].lastModified = '2015-05-28T16:30:00Z';
    violation[0].checked = true;
    violation[0].comment = req.body.comment;
    // add new
    VIOLATIONS = VIOLATIONS.concat(violation);
    res.status(200).send();
});

module.exports = server;