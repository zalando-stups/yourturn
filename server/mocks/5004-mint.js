var express = require('express'),
    bodyParser = require('body-parser'),
    server = express();

server.use(bodyParser.json());

var apps = {
    kio: {
        id: 'kio',
        username: 'kio-robot',
        last_password_rotation: '2015-01-02T12:42:41Z',
        last_client_rotation: '2015-01-01T12:42:41Z',
        last_modified: '2015-01-01T12:42:41Z',
        last_synced: '2015-01-03T12:42:41Z',
        has_problems: false,
        message: '',
        is_client_confidential: false,
        redirect_url: 'http://example.com/oauth',
        s3_buckets: [
            'kio-stups-bucket'
        ],
        scopes: [{
            resource_type_id: 'customer',
            scope_id: 'read_all'
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

server.get('/apps', function(req, res) {
    setTimeout(function() {
        res.status(200).send(Object.keys(apps).map(function(a) { return apps[a]; }));    
    }, Math.random() * 2000);
});

server.get('/apps/:id', function(req,res){
    setTimeout( function() {
        var id = req.params.id;
        if (!apps[id]) {
            res.status(404).send();
        } else {
            res.status(200).send(apps[id]);
        }
    }, Math.random() * 2000 );
});

server.put('/apps/:id', function(req, res) {
    setTimeout( function() {
        var id = req.params.id;
        apps[id] = req.body;
        apps[id].scopes = req.body.scopes ? req.body.scopes : [];
        apps[id].s3_buckets = req.body.s3_buckets ? req.body.s3_buckets : [];
        res.status(200).send();
    }, Math.random() * 2000 );
});

server.post('/apps/:id/renewal', function(req, res) {
    setTimeout( function() {
        res.status(200).send();
    }, Math.random() * 2000 );
});

module.exports = server;