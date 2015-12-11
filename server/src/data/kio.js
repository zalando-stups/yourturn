var request = require('superagent-bluebird-promise'),
    tokens = require('../tokens'),
    redis = require('../redis');

function apps() {
    return request
            .get(`${process.env.YTENV_KIO_BASE_URL}/apps`)
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
