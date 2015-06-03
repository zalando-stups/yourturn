var express = require('express'),
    server = express();

var user = {
    npiccolotto: [{
        id: 'stups',
        'infrastructure-accounts': [
          {
            id: '123456789',
            type: 'aws'
          }
        ],
        name: 'stups'
      },
      {
        id: 'greendale',
        'infrastructure-accounts': [
          {
            id: '10987654321',
            type: 'aws'
          }
        ],
        name: 'greendale'
    }]
};

/** enable cors */
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

server.get('/user/:id', function(req,res){
    setTimeout( function() {
        var id = req.params.id;
        if (!user[id]) {
            res.status(404).send();
        }
        res.status(200).send(user[id]);
    }, Math.random() * 2000 );
});

module.exports = server;
