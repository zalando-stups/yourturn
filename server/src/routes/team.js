var winston = require('winston'),
    request = require('superagent-bluebird-promise');

function teams(req, res) {
    request
        .get(process.env.YTENV_TEAM_BASE_URL + '/teams')
        .accept('json')
        .set('Authorization', req.get('Authorization'))
        .then(response => {
            var teamsWithId = response.body.filter(team => !!team.id);
            return res.status(200).type('json').send(teamsWithId);
        })
        .catch(err => {
            winston.error('Could not GET /teams: %d %s', err.status || 0, err.message);
            return res.status(err.status || 0).send(err);
        });
}

function team(req, res) {
    request
        .get(process.env.YTENV_TEAM_BASE_URL + '/teams/' + req.params.teamId)
        .accept('json')
        .set('Authorization', req.get('Authorization'))
        .then(response => res
                            .status(200)
                            .type('json')
                            .send(response.body))
        .catch(err => {
            winston.error('Could not GET /team: %d %s', err.status || 0, err.message);
            return res.status(err.status || 0).send(err);
        });
}

function accounts(req, res) {
    request
        .get(process.env.YTENV_TEAM_BASE_URL + '/accounts/aws')
        .accept('json')
        // take OAuth token from request
        .set('Authorization', req.get('Authorization'))
        .then(response => res
                            .status(200)
                            .type('json')
                            .send(response.body))
        .catch(err => {
            winston.error('Could not GET /accounts: %d %s', err.status || 0, err.message);
            return res.status(err.status || 0).send(err);
        });
}

module.exports = {
    accounts,
    teams,
    team
};
