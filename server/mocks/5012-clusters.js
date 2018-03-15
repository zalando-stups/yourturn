var express = require('express'),
    bodyParser = require('body-parser'),
    server = express();

server.use(bodyParser.json());

var clusters = {
  "items": [
    {
      "alias": "playground",
      "environment": "playground",
      "id": "c-1",
    },
    {
      "alias": "stups-test",
      "environment": "test",
      "id": "c-2",
    },
    {
      "alias": "stups",
      "environment": "production",
      "id": "c-3",
    },
    {
      "alias": "overarching",
      "environment": "production",
      "id": "c-4",
    },
    {
      "alias": "db",
      "environment": "production",
      "id": "c-5",
    },
    {
      "alias": "fashion-store",
      "environment": "production",
      "id": "c-6",
    },
    {
      "alias": "fashion-store-test",
      "environment": "test",
      "id": "c-7",
    },
    {
      "alias": "distributed-commerce",
      "environment": "production",
      "id": "c-8",
    },
    {
      "alias": "distributed-commerce-test",
      "environment": "test",
      "id": "c-9",
    },
    {
      "alias": "teapot",
      "environment": "test",
      "id": "c-10",
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
