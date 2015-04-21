var express = require('express'),
    bodyParser = require('body-parser'),
    server = express();

server.use(bodyParser.json());

var applications = {
    kio: {
        documentation_url: 'https://github.com/zalando-stups/kio',
        scm_url: 'https://github.com/zalando-stups/kio.git',
        service_url: 'https://kio.example.org/',
        description: 'An application registry to manage application base information.',
        subtitle: 'STUPS application registry',
        name: 'Kio',
        active: true,
        team_id: 'stups',
        id: 'kio'
    },
    pierone: {
        documentation_url: 'https://github.com/zalando-stups/pierone',
        scm_url: 'https://github.com/zalando-stups/pierone.git',
        service_url: 'https://pierone.example.org/',
        description: 'A Docker registry compliant repository for Docker images.',
        subtitle: 'STUPS Docker registry',
        name: 'Pier One',
        active: false,
        team_id: 'stups',
        id: 'pierone'
    },
    tzjztjtzj: {
        id: 'tzjztjtzj',
        name: 'testy 2',
        team_id: 'stups',
        description: 'Test application 2',
        url: 'https://test2.example.org',
        scm_url: 'git://github.com/zalando-stups/test2'
    }
};

/** enable cors */
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

server.get('/apps', function(req,res) {
    var apps = Object
                .keys( applications )
                .map( function( k ) {
                    return applications[k];
                });

    setTimeout( function() {
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
        applications[req.body.id] = req.body;
        res.status(200).send(req.body);
    }, Math.random() * 2000 );
});

server.listen(5000);