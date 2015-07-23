var express = require('express'),
    server = express();

var teams = {
        npiccolotto: [{
            id: 'stups',
            id_name: 'STUPS',
            name: 'stups'
        }, {
            id: 'greendale',
            id_name: 'Greendale',
            name: 'greendale'
        }]
    },
    accounts = {
        npiccolotto: [{
            id: '123456789',
            name: 'stups',
            type: 'aws',
            description: 'STUPS account'
        },
        {
            id: '0987654321',
            name: 'stups-test',
            type: 'aws',
            description: 'STUPS test account'
        }]
    };

/** enable cors */
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

server.get('/accounts/:id', function(req,res){
    setTimeout( function() {
        var id = req.params.id;
        if (!accounts[id]) {
            res.status(404).send();
        }
        res.status(200).send(accounts[id]);
    }, Math.random() * 2000 );
});

module.exports = server;
