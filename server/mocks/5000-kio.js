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
        team_id: 'stups',
        id: 'kio',
        required_approvers: 2,
        criticality_level: 3
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
        criticality_level: 2
    },
    tzjztjtzj: {
        id: 'tzjztjtzj',
        name: 'testy 2',
        team_id: 'stups',
        description: 'Test application 2',
        url: 'https://test2.example.org',
        scm_url: 'git://github.com/zalando-stups/test2',
        required_approvers: 2,
        criticality_level: 2
    }
};

var versions = {
    kio: {
        "1": {
            "id": "1",
            "application_id": "kio",
            "last_modified": "2015-05-28T16:30:00Z",
            "artifact": "docker://stups/kio:1"
        },
        "0.9": {
            "id": "0.9",
            "application_id": "kio",
            "last_modified": "2015-05-21T06:30:00Z",
            "artifact": "docker//stups/kio:0.9"
        },
        "0.9-beta": {
            "id": "0.9-beta",
            "application_id": "kio",
            "last_modified": "2015-05-19T10:45:00Z",
            "artifact": "docker//stups/kio:0.9-beta"
        },
        "0.9-alpha": {
            "id": "0.9-alpha",
            "application_id": "kio",
            "last_modified": "2015-05-11T16:30:00Z",
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

server.get('/apps/:id/versions', function(req, res) {
    setTimeout( function() {
        var id = req.params.id;
        if (applications[id]) {
            if (versions[id]) {
                var list = Object
                    .keys(versions[id])
                    .map(function(key) {
                        return versions[id][key];
                    });
                return res.status(200).send(list);
            }
            return res.status(200).send([]);
        }
        return res.status(404).send();
    }, Math.random() * 2000 );
});

server.get('/apps/:id/versions/:ver', function(req, res) {
    setTimeout( function() {
        var id = req.params.id;
        var ver = req.params.ver;
        if (versions[id][ver]) {
            return res.status(200).send(versions[id][ver]);
        }
        return res.status(404).send();
    }, Math.random() * 2000 );
});

server.put('/apps/:id/versions/:ver', function(req, res) {
    setTimeout( function() {
        var id = req.params.id;
        var ver = req.params.ver;
        if (applications[id]) {
            if (!versions[id]) {
                versions[id] = {};
            }
            versions[id][ver] = req.body;
            versions[id][ver].application_id = id;
            versions[id][ver].id = ver;
            // delete approvals for this version
            if (approvals[id] && approvals[id][ver]) {
                approvals[id][ver] = [];
            }
            return res.status(200).send();
        }
        return res.status(404).send();
    }, Math.random() * 2000 );
});

server.get('/apps/:id/approvals', function(req, res) {
    setTimeout( function() {
        return res.status(200).send(["MANUAL_TEST"]);
    }, Math.random() * 2000 );
});

server.get('/apps/:id/versions/:ver/approvals', function(req, res) {
    setTimeout( function() {
        var id = req.params.id;
        var ver = req.params.ver;
        if (approvals[id] && approvals[id][ver]) {
            return res.status(200).send(approvals[id][ver]);
        }
        if (applications[id] && versions[id] && versions[id][ver]) {
            return res.status(200).send([]);
        }
        return res.status(404).send();
    }, Math.random() * 2000 );
});

server.post('/apps/:id/versions/:ver/approvals', function(req, res) {
    setTimeout( function() {
        var id = req.params.id;
        var ver = req.params.ver;
        if (!approvals[id]) {
            approvals[id] = {};
        }
        if (!approvals[id][ver]) {
            approvals[id][ver] = [];
        }

        var approval = req.body;
        approval.application_id = id;
        approval.version_id = ver;
        approval.approved_at = '2015-04-25T17:25:00';
        approval.user_id = 'test_user';
        approvals[id][ver].push(approval);
        res.status(200).send();
    }, Math.random() * 2000 );
});

module.exports = server;
