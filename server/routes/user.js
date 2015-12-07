var winston = require('winston'),
    request = require('superagent');

function detail(req, res) {
    request
        .get(process.env.YTENV_USER_BASE_URL + '/employees/' + req.params.userId)
        .accept('json')
        .set('Authorization', req.get('Authorization'))
        .end(function(err, response) {
            if (err) {
                winston.error('Could not GET /employees/%s: %d %s', req.params.userId, err.status || 0, err.message);
                return res.status(err.status || 0).send(err);
            }
            return res
                    .status(200)
                    .type('json')
                    .send(response.text);
        });
};

function accounts(req, res) {
    request
        .get(process.env.YTENV_TEAM_BASE_URL + '/accounts/aws?member=' + req.params.userId)
        .accept('json')
        // take OAuth token from request
        .set('Authorization', req.get('Authorization'))
        .end(function(err, response) {
            if (err) {
                winston.error('Could not GET /accounts/%s: %d %s', req.params.userId, err.status || 0, err.message);
                return res.status(err.status || 0).send(err);
            }
            return res
                    .status(200)
                    .type('json')
                    .send(response.text);
        });
}

module.exports = {
    accounts,
    detail
};