var express = require('express'),
    bodyParser = require('body-parser'),
    server = express();

server.use(bodyParser.json());

var resourceTypes = {
    'sales_order': {
        'id': 'sales_order',
        'name': 'Sales Order',
        'description': 'Sales Orders',
        'resource_owners': [
            'employees'
        ]
    },
    'customer': {
        'id': 'customer',
        'name': 'Customer',
        'description': 'Customer',
        'resource_owners': []
    },
    'customer1': {
        'id': 'customer1',
        'name': 'Customer1',
        'description': 'Customer1',
        'resource_owners': []
    },
    'customer2': {
        'id': 'customer2',
        'name': 'Customer2',
        'description': 'Customer2',
        'resource_owners': []
    },
    'customer3': {
        'id': 'customer3',
        'name': 'Customer3',
        'description': 'Customer3',
        'resource_owners': []
    },
    'customer4': {
        'id': 'customer4',
        'name': 'Customer4',
        'description': 'Customer4',
        'resource_owners': []
    },
    'customer5': {
        'id': 'customer5',
        'name': 'Customer5',
        'description': 'Customer5',
        'resource_owners': []
    },
    'empty': {
        'id': 'empty',
        'name': 'Empty',
        'description': 'Empty',
        'resource_owners': []
    }
};
var resourceScopes = {
    'sales_order': {
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
    },
    'customer1': {
        'read': {
            'id': 'read',
            'summary': 'Grants read-access to all customer data',
            'description': 'Description',
            'user_information': 'Read all base information',
            'is_resource_owner_scope': false
        },
        'write': {
            'id': 'write',
            'summary': 'Grants write-access to all customer data',
            'description': 'Description',
            'user_information': 'Write all base information',
            'is_resource_owner_scope': false
        }
    },
    'customer2': {
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
    },
    'customer3': {
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
    },
    'customer4': {
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
    },
    'customer5': {
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
        req.body.id = req.params.id;
        resourceTypes[req.params.id] = req.body;
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
        req.body.id = scopeId;
        if (!resourceScopes[id]) {
            resourceScopes[id] = {};
        }
        resourceScopes[id][scopeId] = req.body;
        res.status( 200 ).send();
    }, Math.random() * 2000 );
});

module.exports = server;

module.exports.resourceTypes = resourceTypes;
module.exports.resourceScopes = resourceScopes;
