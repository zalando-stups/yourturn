var express = require('express'),
    bodyParser = require('body-parser'),
    server = express();

server.use(bodyParser.json());

var clusters = {
  "items": [
    {
      'alias': 'st',
      'environment': 'pg',
      'id': 'c-1'
    },
    {
      'alias': 'st-t',
      'environment': 't',
      'id': 'c-2'
    },
    {
      'alias': 'st',
      'environment': 'production',
      'id': 'c-3'
    },
    {
      'alias': 'ovra',
      'environment': 'production',
      'id': 'c-4'
    },
    {
      'alias': 'database',
      'environment': 'production',
      'id': 'c-5'
    },
    {
      'alias': 'f-store',
      'environment': 'production',
      'id': 'c-6'
    },
    {
      'alias': 'f-store-test',
      'environment': 't',
      'id': 'c-7'
    },
    {
      'alias': 'dist',
      'environment': 'production',
      'id': 'c-8'
    },
    {
      'alias': 'dist-test',
      'environment': 't',
      'id': 'c-9'
    },
    {
      'alias': 'tp',
      'environment': 't',
      'id': 'c-10'
    }  ]
};

/** enable cors */
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

server.get('/kubernetes-clusters', function(req,res) {
  console.log('got it');
    setTimeout( function() {
        res.status( 200 ).send( clusters );
    }, Math.random() * 2000 );
});

module.exports = server;
