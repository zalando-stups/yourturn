var request = require('superagent-bluebird-promise');

/**
 * OAuth 2 middleware.
 */
module.exports = function(req, res, next) {
    // if there is no token, respond with 401
    if (!req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer ')) {
        return res
                .status(401)
                .set('WWW-Authenticate', 'OAuth2')
                .send();
    }

    var header = req.headers.authorization,
        token = header.substring('Bearer '.length);

    // verify token
    request
        .get(process.env.YTENV_OAUTH_TOKENINFO_URL)
        .query({
            access_token: token
        })
        .then(() => {
            next();
        })
        .catch(err => {
            res
            .status(401)
            .set('WWW-Authenticate', 'OAuth2')
            .send();
        });
};
