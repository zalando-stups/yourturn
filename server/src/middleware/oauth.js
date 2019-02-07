var request = require('superagent-bluebird-promise');

function sendGenericError(res) {
    return res
            .status(401)
            .set('WWW-Authenticate', 'OAuth2')
            .send();
}

/**
 * OAuth 2 middleware.
 */
module.exports = function(req, res, next) {
    // if there is no token, respond with 401
    if (!req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer ')) {
        return sendGenericError(res);
    }

    var accessToken = req.get("authorization");

    // verify token
    request
        .get(process.env.YTENV_OAUTH_TOKENINFO_URL)
        .set({
            "Authentication": accessToken
          })
        .then(tokeninfo => {
            req.tokeninfo = tokeninfo.body;
            if (tokeninfo.body.realm === '/employees' ||
                tokeninfo.body.realm === '/services') {
                return next();
            }
            return sendGenericError(res);
        })
        .catch(err => sendGenericError(res));
};
