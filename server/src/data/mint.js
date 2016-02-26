var request = require('superagent-bluebird-promise'),
    tokens = require('../tokens');


function app(appId) {
    return request
            .get(`${process.env.YTENV_MINT_BASE_URL}/apps/${appId}`)
            .set('Authorization', `Bearer ${tokens.get('mint')}`)
            .accept('json')
            .then(res => res.body);
}

module.exports = {
    app
};
