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

var versions = {
    kio: {
        "1": {
            "id": "1",
            "application_id": "kio",
            "artifact": "docker://stups/kio:1.0"
        },
        "0.9": {
            "id": "0.9",
            "application_id": "kio",
            "artifact": "docker//stups/kio:0.9"
        },
        "0.9-beta": {
            "id": "0.9-beta",
            "application_id": "kio",
            "artifact": "docker//stups/kio:0.9-beta"
        },
        "0.9-alpha": {
            "id": "0.9-alpha",
            "application_id": "kio",
            "artifact": "docker//stups/kio:0.9-alpha"
        }
    }
};

var approvals = {
    kio: {
        "1": [{
            "application_id": "kio",
            "version_id": "1",
            "approval_type": "TESTED",
            "user_id": "npiccolotto",
            "approved_at": "2015-04-25T16:25:00"
        }, {
            "application_id": "kio",
            "version_id": "1",
            "approval_type": "TESTED",
            "user_id": "tobi",
            "approved_at": "2015-04-25T16:40:00"
        }]
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
        applications[req.params.id] = req.body;
        res.status(200).send();
    }, Math.random() * 2000 );
});

server.get('/apps/:id/versions', function(req, res) {
    setTimeout( function() {
        var id = req.params.id;
        if (id !== 'kio') {
            res.status(404).send();
        } else {
            var list = Object
                        .keys(versions.kio)
                        .map(function(key) {
                            return versions.kio[key];
                        });
            res.status(200).send(list);
        }
    }, Math.random() * 2000 );
});

server.get('/apps/:id/versions/:ver', function(req, res) {
    setTimeout( function() {
        var id = req.params.id;
        var ver = req.params.ver;
        if (id !== 'kio' || !versions.kio[ver]) {
            res.status(404).send();
        } else {
            res.status(200).send(versions.kio[ver]);
        }
    }, Math.random() * 2000 );
});

server.put('/apps/:id/versions/:ver', function(req, res) {
    setTimeout( function() {
        var id = req.params.id;
        var ver = req.params.ver;
        if (id !== 'kio') {
            res.status(404).send();
        } else {
            versions.kio[ver] = req.body;
            res.status(200).send();
        }
    }, Math.random() * 2000 );
});

server.get('/apps/:id/versions/:ver/approvals', function(req, res) {
    setTimeout( function() {
        var id = req.params.id;
        var ver = req.params.ver;
        if (id !== 'kio') {
            res.status(404).send();
        } else {
            res.status(200).send(approvals.kio[ver]);
        }
    }, Math.random() * 2000 );
});

server.post('/apps/:id/versions/:ver/approvals', function(req, res) {
    setTimeout( function() {
        var id = req.params.id;
        var ver = req.params.ver;
        if (id !== 'kio') {
            res.status(404).send();
        } else {
            var approval = req.body;
            approval.approved_at = '2015-04-25T17:25:00';
            approval.application_id = id;
            approval.user_id = 'test_user';
            approval.version_id = ver;
            if (!approvals.kio[ver]) {
                approvals.kio[ver] = [];
            };
            approvals.kio[ver].push(approval);
            res.status(200).send();
        }
    }, Math.random() * 2000 );
});


server.listen(5000);
