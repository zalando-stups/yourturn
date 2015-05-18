var chai = require('chai'),
    jsdom = require('jsdom'),
    sinon = require('sinon'),
    Mitm = require('mitm'),
    OAuth = require('oauth2-client-js'),
    localStorage = new OAuth.MemoryStorage();

// globals for tests
global.sinon = sinon;
global.expect = chai.expect;
global.Mitm = Mitm;

// shim window
localStorage.set('stups-access_token', 'access_token');
global.window = {
    // fake document that hopefully works with jquery
    document: jsdom.jsdom(),
    location: {
        href: ''
    },
    // OAuth Provider uses localStorage by default
    // so we feed it the in-memory storage for testing
    localStorage: localStorage
};
global.document = global.window.document;
// these are set by env.js in production
global.YTENV_TWINTIP_BASE_URL = '';
global.YTENV_KIO_BASE_URL = '';
global.YTENV_MINT_BASE_URL = '';
global.YTENV_ESSENTIALS_BASE_URL = '';
global.YTENV_TEAM_BASE_URL = '';
global.YTENV_PIERONE_BASE_URL = '';
global.YTENV_OAUTH_CLIENT_ID = '';
global.YTENV_OAUTH_AUTH_URL = '';
global.YTENV_OAUTH_TOKENINFO_URL='';
global.YTENV_OAUTH_REDIRECT_URI = '';
global.YTENV_OAUTH_SCOPES = '';
global.YTENV_SERVICE_URL_TLD = '';
global.YTENV_DOCKER_REGISTRY = '';