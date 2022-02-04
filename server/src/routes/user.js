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
}

function teams(req, res) {
    request
        .get(process.env.YTENV_TEAM_BASE_URL + '/teams?member=' + req.params.userId)
        .accept('json')
        // take OAuth token from request
        .set('Authorization', req.get('Authorization'))
        .then(response => res
                            .status(200)
                            .type('json')
                            .send(response.text))
        .catch(err => {
            winston.error('Could not GET /teams?member=%s: %d %s', req.params.userId, err.status || 0, err.message);
            return res.status(err.status || 0).send(err);
        });
}

function accounts(req, res) {
    const authorization = req.get('Authorization');
    const roles = ["PowerUser", "Deployer"];
    const requests = roles.map(role =>
        request.get(process.env.YTENV_TEAM_BASE_URL + '/accounts/aws?member=' + req.params.userId + '&role=' + role)
               .accept('json')
               .set('Authorization', authorization));
    Promise.all(requests)
        .then(results => {
            const accounts = [];
            results.forEach(result =>
                result.body.forEach(account => {
                    if (accounts.every(existingAccount => existingAccount.id !== account.id)){
                        accounts.push(account);
                    }
                })
            );
            return res.status(200)
                .type('json')
                .send(accounts)
        })
        .catch(err => {
            winston.error('Could not GET /accounts/aws/%s: %d %s', req.params.userId, err.status || 0, err.message);
            return res.status(err.status || 0).send(err);
        });
}

/**
 * @type {import('express').RequestParamHandler}
 */
const allowList = function (req, res) {
  const allowListOfUsers = (process.env.YTENV_RESOURCE_WHITELIST || '')
    .split(/\s/)
    .filter(i => !!i);
  res.status(200).json(allowListOfUsers);
}

module.exports = {
    accounts,
    detail,
    teams,
    allowList
};
