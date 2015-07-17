var express = require('express'),
    server = express();

var teams = {
        stups: {
            id: 'stups',
            id_name: 'STUPS',
            'infrastructure-accounts': [
              {
                id: '123456789',
                type: 'aws'
              }
            ],
            name: 'stups'
          },
          greendale: {
            id: 'greendale',
            id_name: 'Greendale',
            'infrastructure-accounts': [
              {
                id: '10987654321',
                type: 'aws'
              }
            ],
            name: 'greendale'
        }
    },
    user = {
        npiccolotto: [{
            id: 'stups',
            id_name: 'STUPS',
            name: 'Cloud Engineering / Paas'
          },
          {
            id: 'greendale',
            id_name: 'Greendale',
            name: 'IAM'
        }]
    };

/** enable cors */
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

server.get('/teams/:id', function(req,res){
    setTimeout( function() {
        var id = req.params.id;
        if (!teams[id]) {
            res.status(404).send();
        }
        res.status(200).send(teams[id]);
    }, Math.random() * 2000 );
});

server.get('/membership/:id', function(req,res){
    setTimeout( function() {
        var id = req.params.id;
        if (!user[id]) {
            res.status(404).send();
        }
        res.status(200).send(user[id]);
    }, Math.random() * 2000 );
});

module.exports = server;
