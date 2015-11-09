/* global require */
var express = require('express'),
    server = express(),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    VIOLATIONS = JSON.parse(fs.readFileSync(__dirname + '/fullstop-violations.json')),
    VIOLATION_TYPES = JSON.parse(fs.readFileSync(__dirname + '/fullstop-violation-types.json')),
    VIOLATION_COUNT = JSON.parse(fs.readFileSync(__dirname + '/fullstop-violation-count.json')),
    VIOLATION_COUNT_ACCOUNT = JSON.parse(fs.readFileSync(__dirname + '/fullstop-violation-count-account.json'));

server.use(bodyParser.text());
/** enable cors */
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

server.get('/violations', function(req, res) {
    setTimeout(function() {
        var all = VIOLATIONS;
        if (req.query.checked) {
            var checked = req.query.checked === 'true';
            all = all.filter(function(v) { return !!v.comment === checked; });
        }
        res
            .status(200)
            .type('json')
            .send({
                total_elements: all.length,
                last: true,
                number: 2,
                content: all
            });
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

server.post('/violations/:violationId/resolution', function(req, res) {
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

    violation[0].comment = req.body;
    violation[0].last_modified_by = 'npiccolotto';
    violation[0].last_modified = '2015-05-28T16:30:00Z';

    // add new
    VIOLATIONS = VIOLATIONS.concat(violation);
    res.status(200).send(violation[0]);
});

server.get('/violation-types', function(req, res) {
    setTimeout(function() {
        res.status(200).send(VIOLATION_TYPES);
    }, Math.random() * 2000);
});

server.get('/violation-count', function(req, res) {
    setTimeout(function() {
        res.status(200).send(VIOLATION_COUNT);
    }, Math.random() * 2000);
});

server.get('/violation-count/:account', function(req, res) {
    setTimeout(function() {
        res.status(200).send(VIOLATION_COUNT_ACCOUNT);
    }, Math.random() * 2000);
});

module.exports = server;
