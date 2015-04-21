var express = require('express'),
    server = express();

var apis = [
    {
        ui: '/ui/',
        url: '/swagger.json',
        version: '0.2',
        name: 'Kio API',
        type: 'swagger-2.0',
        status: 'SUCCESS',
        application_id: 'kio'
    },
    {
        ui: '/ui/',
        url: '/swagger.json',
        version: '1.0',
        name: 'Pier One API',
        type: 'swagger-2.0',
        status: 'SUCCESS',
        application_id: 'pierone'
    }
];

/** enable cors */
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

server.get('/apis', function(req, res) {
    res.status(200).send(apis);
});

server.get('/apis/:id', function(req,res){
    setTimeout( function() {
        var id = req.params.id;
        if (!apis[id]) {
            res.status(404).send();
        } else {
            var api = apis.filter(function(api) {
                return api.application_id === id;
            });
            res.status(200).send(api[0]);
        }
    }, Math.random() * 2000 );
});

server.listen(5001);
