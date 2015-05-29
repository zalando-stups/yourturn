var express = require('express'),
    server = express();

var scmSource = {
  url: 'git:git@github.com:zalando-stups/pierone.git',
  revision: 'cd768599e1bb41c38279c26254feff5cf57bf967',
  author: 'npiccolotto',
  status: 'M package.json'
};

var images = [{
    name: 'stups/yourturn',
    tag: '1.0'
}];

/** enable cors */
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

server.get('/teams/:team/artifacts/:artifact/tags/:tag/scm-source', function(req, res) {
    if (req.params.team === 'stups' &&
        req.params.artifact === 'kio' &&
        req.params.tag === '1.0') {
        return res
                .status(200)
                .type('json')
                .send(scmSource);
    }
    res.status(404).send();
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