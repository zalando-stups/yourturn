var express = require('express'),
    server = express(),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    VIOLATIONS = JSON.parse(fs.readFileSync(__dirname + '/fullstop-violations.json'));
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
            all = all.filter(function(v) { return v.checked === checked; });
        }
        res
            .status(200)
            .type('json')
            .send({
                // spring paging :(
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

module.exports = server;