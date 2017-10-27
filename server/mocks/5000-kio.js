var express = require('express'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    server = express(),
    swagger = fs.readFileSync(__dirname + '/kio-api.json');

server.use(bodyParser.json());

var applications = {
    kio: {
        documentation_url: 'https://github.com/zalando-stups/kio',
        specification_url: 'https://github.com/zalando-stups/kio/issues',
        scm_url: 'https://github.com/zalando-stups/kio.git',
        service_url: 'http://localhost:5000/',
        description: '**An application registry to manage application base information.**',
        subtitle: 'STUPS application registry',
        name: 'Kio',
        active: true,
        team_id: 'stups-test',
        id: 'kio',
        required_approvers: 2,
        criticality_level: 3,
        publicly_accessible: true
    },
    pierone: {
        documentation_url: 'https://github.com/zalando-stups/pierone',
        specification_url: 'https://github.com/zalando-stups/pierone/issues',
        scm_url: 'https://github.com/zalando-stups/pierone.git',
        service_url: 'https://pierone.example.org/',
        description: 'A Docker registry compliant repository for Docker images.',
        subtitle: 'STUPS Docker registry',
        name: 'Pier One',
        active: false,
        team_id: 'stups',
        id: 'pierone',
        required_approvers: 2,
        criticality_level: 2,
        publicly_accessible: true
    },
    spilo: {
        documentation_url: 'https://github.com/zalando-stups/spilo',
        specification_url: 'https://github.com/zalando-stups/spilo/issues',
        scm_url: 'https://github.com/zalando-stups/spilo.git',
        service_url: 'http://localhost:5000/',
        description: '**An application registry to manage application base information.**',
        subtitle: 'STUPS application registry',
        name: 'Blork',
        active: true,
        team_id: 'acid',
        id: 'spilo',
        required_approvers: 2,
        criticality_level: 3,
        publicly_accessible: true
    },
    foobar: {
        documentation_url: 'https://github.com/zalando-stups/foobar',
        specification_url: 'https://github.com/zalando-stups/foobar/issues',
        scm_url: 'https://github.com/zalando-stups/foobar.git',
        service_url: 'https://foobar.example.org/',
        description: 'A Docker registry compliant repository for Docker images.',
        subtitle: 'STUPS Docker registry',
        name: 'foobar',
        active: false,
        team_id: 'foobar-team',
        id: 'foobar',
        required_approvers: 2,
        criticality_level: 2,
        publicly_accessible: true
    },
};

/** enable cors */
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

server.get('/swagger.json', function(req, res) {
    res
        .type('json')
        .status(200)
        .send(swagger);
});

server.get('/apps', function(req,res) {
    var apps = Object
                .keys( applications )
                .map( function( k ) {
                    return applications[k];
                });

    setTimeout( function() {
        if (req.query.search) {
            var results = apps.map(function( a ) {
                                if (req.query.search) {
                                    a.matched_rank = Math.random() * 3;
                                    a.matched_description = '<b>' + req.query.search + '</b> change could not be applied."]},"detail":{"type":"string","description":"Contains more descriptive text or error';
                                    return a;
                                }
                                return a;
                            });
            return res.status(200).send(results);
        }
        if (req.query.team_id) {
            var results = apps.filter(a => a.team_id === req.query.team_id);
            return res.status(200).send(results);
        }
        res.status( 200 ).send( apps );
    }, Math.random() * 2000 );
});

server.get('/apps/:id', function(req,res){
    setTimeout( function() {
        var id = req.params.id;
        if (!applications[id]) {
            res.status(404).send();
        } else {
            res.status(200).send(applications[req.params.id]);
        }
    }, Math.random() * 2000 );
});

server.put('/apps/:id', function(req, res) {
    setTimeout( function() {
        var id = req.params.id;
        req.body.id = id;
        applications[id] = req.body;
        res.status(200).send();
    }, Math.random() * 2000 );
});

server.put('/apps/:id/criticality', function(req, res) {
    setTimeout( function() {
        var id = req.params.id,
            criticality_level = req.body.criticality_level;
        applications[id].criticality_level = criticality_level;
        res.status(200).send();
    }, Math.random() * 2000 );
});

module.exports = server;
