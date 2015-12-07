var winston = require('winston'),
    request = require('superagent');


function accounts(req, res) {
    request
        .get(process.env.YTENV_TEAM_BASE_URL + '/accounts/aws')
        .accept('json')
        // take OAuth token from request
        .set('Authorization', req.get('Authorization'))
        .end(function(err, response) {
            if (err) {
                winston.error('Could not GET /accounts: %d %s', err.status || 0, err.message);
                return res.status(err.status || 0).send(err);
            }
            return res
                    .status(200)
                    .type('json')
                    .send(response.text);
        });
}

module.exports = {
    accounts
};