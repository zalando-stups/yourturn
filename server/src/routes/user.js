var winston = require('winston'),
    request = require('superagent-bluebird-promise');

function detail(req, res) {
    request
        .get(process.env.YTENV_USER_BASE_URL + '/employees/' + req.params.userId)
        .accept('json')
        .set('Authorization', req.get('Authorization'))
        .then(response => res
                            .status(200)
                            .type('json')
                            .send(response.text))
        .catch(err => {
            winston.error('Could not GET /employees/%s: %d %s', req.params.userId, err.status || 0, err.message);
            return res.status(err.status || 0).send(err);
        });
};

function accounts(req, res) {
    request
        .get(process.env.YTENV_TEAM_BASE_URL + '/accounts/aws?member=' + req.params.userId)
        .accept('json')
        // take OAuth token from request
        .set('Authorization', req.get('Authorization'))
        .then(response => res
                    .status(200)
                    .type('json')
                    .send(response.text))
        .catch(err => {
            winston.error('Could not GET /accounts/%s: %d %s', req.params.userId, err.status || 0, err.message);
            return res.status(err.status || 0).send(err);
        });
}

module.exports = {
    accounts,
    detail
};
