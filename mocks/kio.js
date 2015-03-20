var express = require('express'),
    server = express();

var applications = {
    uuid123: {
        id: 'uuid123',
        name: 'kio',
        team_id: 'stups',
        description: 'Application Repository',
        url: 'https://kio.stups.zalan.do',
        scm_url: 'git://github.com/zalando-stups/kio'
    },
    asdfasdf: {
        id: 'asdfasdf',
        name: 'testy',
        team_id: 'stups',
        description: 'Test application',
        url: 'https://test.stups.zalan.do',
        scm_url: 'git://github.com/zalando-stups/test'
    }
};

/** enable cors */
server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

server.get('/applications', function(req,res) {
    var apps = Object
                .keys( applications )
                .map( function( k ) {
                    return applications[k];
                });

    res.status( 200 ).send( apps );
});

server.get('/applications/:id', function(req,res){
    res.status(200).send(applications[req.params.id]);
});

server.listen(5000);