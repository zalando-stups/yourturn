var express = require('express'),
    bodyParser = require('body-parser'),
    server = express();

server.use(bodyParser.json());

var apps = {
    kio: {
        id: 'kio',
        username: 'kio-robot',
        last_password_rotation: '2015-01-01T12:42:41Z',
        last_client_rotation: '2015-01-01T12:42:41Z',
        last_modified: '2015-01-01T12:42:41Z',
        last_synced: '2015-01-01T12:42:41Z',
        has_problems: false,
        redirect_url: 'http://example.com/oauth',
        accounts: [{
            id: '1239847235987',
            type: 'aws'
        }],
        scopes: [{
            resourceId: 'sales_order',
            id: 'create'
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
        res.status(200).send();
    }, Math.random() * 2000 );
})

server.listen(5004);
