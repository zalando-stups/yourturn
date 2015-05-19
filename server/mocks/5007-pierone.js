var express = require('express'),
    server = express();

var images = [{
    name: 'stups/yourturn',
    tag: '0.22-SNAPSHOT'
}];

/** enable cors */
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

server.get('/v1/search', function(req,res) {
    res
        .type('json')
        .status(200)
        .send({
            results: images
        });
});

module.exports = server;