var winston = require('winston'),
    request = require('superagent-bluebird-promise'),
    tokens = require('../tokens'),
    redis = require('../redis');

function apps() {
    return request
            .get(`${process.env.YTENV_KIO_BASE_URL}/apps`)
            .set('Authorization', `Bearer ${tokens.get('kio')}`)
            .accept('json');
}

function versions(app) {
    return request
            .get(`${process.env.YTENV_KIO_BASE_URL}/apps/${app}/versions`)
            .set('Authorization', `Bearer ${tokens.get('kio')}`)
            .accept('json');
}


module.exports = {
    apps,
    versions
};