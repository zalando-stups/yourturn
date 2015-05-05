var express = require('express'),
    bodyParser = require('body-parser'),
    server = express();

server.use(bodyParser.json());

var resourceTypes = {};
var resourceScopes = {};


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
        res.status( 200 ).send(req.body);
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
        res.status( 200 ).send(req.body);
    }, Math.random() * 2000 );
});
server.listen(5003);
