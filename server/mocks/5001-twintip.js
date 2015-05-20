var express = require('express'),
    server = express();

var apis = {
    kio: {
        ui: '/ui/',
        url: '/swagger.json',
        version: '0.2',
        name: 'Kio API',
        type: 'swagger-2.0',
        status: 'SUCCESS',
        application_id: 'kio'
    },
    pierone: {
        ui: '/ui/',
        url: '/swagger.json',
        version: '1.0',
        name: 'Pier One API',
        type: 'swagger-2.0',
        status: 'SUCCESS',
        application_id: 'pierone'
    }
};

/** enable cors */
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

server.get('/apps', function(req, res) {
    var apps = Object.keys(apis).map(function(api) { return apis[api]; });
    res.status(200).send(apps);
});

server.get('/apps/:id', function(req,res){
    setTimeout( function() {
        var id = req.params.id;
        if (!apis[id]) {
            res.status(404).send();
        } else {
            res.status(200).send(apis[id]);
        }
    }, Math.random() * 2000 );
});

module.exports = server;