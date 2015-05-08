var express = require('express'),
    bodyParser = require('body-parser'),
    server = express();

server.use(bodyParser.json());

var resourceTypes = {
    'sales-order': {
        'id': 'sales-order',
        'name': 'Sales Order',
        'description': 'Sales Orders',
        'resource_owners': [
            'customer'
        ]
    },
    'customer': {
        'id': 'customer',
        'name': 'Customer',
        'description': 'Customer',
        'resource_owners': []
    }
};
var resourceScopes = {
    'sales-order': {
        'read': {
            'id': 'read',
            'summary': 'Grants read-access to the sales orders of a customer',
            'description': 'Description',
            'user_information': 'Read your Zalando orders',
            'is_resource_owner_scope': true
        }
    },
    'customer': {
        'read_all': {
            'id': 'read_all',
            'summary': 'Grants read-access to all customer data',
            'description': 'Description',
            'user_information': 'Read all base information',
            'is_resource_owner_scope': false
        },
        'write_all': {
            'id': 'write_all',
            'summary': 'Grants write-access to all customer data',
            'description': 'Description',
            'user_information': 'Write all base information',
            'is_resource_owner_scope': false
        }
    }
};


/** enable cors */
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

server.get('/resource-types', function(req,res) {
    setTimeout( function() {
        var types = Object
            .keys( resourceTypes )
            .map( function( k ) {
                return resourceTypes[k];
            });

        res.status( 200 ).send( types );
    }, Math.random() * 2000 );
});

server.get('/resource-types/:id', function(req, res) {
    setTimeout( function() {
        var id = req.params.id;
        if (!resourceTypes[id]) {
            res.status(404).send();
        } else {
            res.status( 200 ).send(resourceTypes[id]);
        }
    }, Math.random() * 2000 );

});

server.put('/resource-types/:id', function(req, res) {
    setTimeout( function() {
        resourceTypes[req.body.id] = req.body;
        res.status( 200 ).send();
    }, Math.random() * 2000 );
});

server.get('/resource-types/:id/scopes', function(req,res){
    setTimeout( function() {
        var id = req.params.id;
        if (!resourceTypes[id]) {
            res.status(404).send();
        } else {
            var scopes = Object
                .keys( resourceScopes[id] || {} )
                .map( function( k ) {
                    return resourceScopes[id][k];
            });
            res.status(200).send(scopes);
        }
    }, Math.random() * 2000 );
});

server.get('/resource-types/:id/scopes/:scopeId', function(req,res){
    setTimeout( function() {
        var id = req.params.id;
        var scopeId = req.params.scopeId;
        if (!resourceScopes[id]) {
            res.status(404).send();
        } else {
            res.status( 200 ).send(resourceScopes[id][scopeId]);
        }
    }, Math.random() * 2000 );

});

server.put('/resource-types/:id/scopes/:scopeId', function(req,res){
    setTimeout( function() {
        var id = req.params.id;
        var scopeId = req.params.scopeId;
        if (!resourceScopes[id]) {
            resourceScopes[id] = {};
        }
        resourceScopes[id][scopeId] = req.body;
        res.status( 200 ).send();
    }, Math.random() * 2000 );
});
server.listen(5003);