var request = require('superagent-bluebird-promise'),
    tokens = require('../tokens'),
    redis = require('../redis');

function apps(team, active = true) {
    return request
            .get(`${process.env.YTENV_KIO_BASE_URL}/apps?active=${active}&team_id=${team}`)
            .set('Authorization', `Bearer ${tokens.get('kio')}`)
            .accept('json')
            .then(res => res.body);
}

function versions(app) {
    return request
            .get(`${process.env.YTENV_KIO_BASE_URL}/apps/${app}/versions`)
            .set('Authorization', `Bearer ${tokens.get('kio')}`)
            .accept('json')
            .then(res => res.body);
}

module.exports = {
    apps,
    versions
};
