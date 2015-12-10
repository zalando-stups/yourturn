module.exports = require('node-tokens')({
    kio: {
        scope: ['uid']
    }
}, {
    oauthTokeninfoUrl: process.env.YTENV_OAUTH_TOKENINFO_URL,
    oauthTokenUrl: process.env.YTENV_OAUTH_TOKEN_URL,
    expirationThreshold: 5 * 60 * 1000, // 5 minutes
    refreshInterval: 10 * 1000 // 10 seconds
});
