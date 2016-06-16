var express = require('express'),
    server = express();

var teams = {
        stups: {
            id: 'stups',
            id_name: 'STUPS',
            name: 'stups',
            alias: ['stups-test']
        },
        greendale: {
            id: 'greendale',
            id_name: 'Greendale',
            name: 'greendale',
            alias: []
        }
    },
    userTeams = {
        npiccolotto: [{
            id: 'stups',
            id_name: 'STUPS',
            name: 'stups',
            alias: ['stups-test']
        }]
    },
    accounts = [{
            id: '1029384756',
            name: 'acid',
            type: 'aws',
            owner: 'acid',
            description: 'ACID Account'
        },
        {
            id: '123456789',
            name: 'stups',
            type: 'aws',
            owner: 'stups',
            description: 'STUPS account'
        },
        {
            id: '0987654321',
            name: 'stups-test',
            type: 'aws',
            owner: 'stups',
            description: 'STUPS test account'
        }],
    userAccounts = {
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

server.get('/accounts/?', function(req, res) {
    setTimeout(function() {
        res.status(200).send(accounts);
    }, Math.random() * 2000);
});

server.get('/accounts/:id', function(req,res){
    setTimeout( function() {
        var id = req.params.id;
        if (!userAccounts[id]) {
            res.status(404).send();
        }
        res.status(200).send(userAccounts[id]);
    }, Math.random() * 2000 );
});

server.get('/users/:user/accounts', function(req, res) {
    setTimeout(function() {
        var user = req.params.user;
        res.status(200).send(userAccounts[user] || []);
    }, Math.random() * 2000);
})

server.get('/users/:user/teams', function(req, res) {
    setTimeout(function() {
        var user = req.params.user;
        res.status(200).send(userTeams[user] || []);
    }, Math.random() * 2000);
})

server.get('/teams/:id', function(req, res) {
    setTimeout(function() {
        var id = req.params.id;
        // check if real team
        if (teams[id]) {
            return res.status(200).send(teams[id]);
        }
        // check if alias
        var isAlias = false;
        Object.keys(teams).forEach(team => {
            if (!isAlias && teams[team].alias.indexOf(id) >= 0) {
                isAlias = team;
                return false;
            }
        });
        if (isAlias) {
            return res.status(200).send(teams[isAlias]);
        }
        res.status(404).send();
    });
});

module.exports = server;
