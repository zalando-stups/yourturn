var chai = require('chai'),
    jsdom = require('jsdom'),
    sinon = require('sinon'),
    OAuth = require('oauth2-client-js');

// globals for tests
global.sinon = sinon;
global.expect = chai.expect;

// shim window
global.window = {
    // fake document that hopefully works with jquery
    document: jsdom.jsdom(),
    location: {
        href: ''
    },
    // OAuth Provider uses localStorage by default
    // so we feed it the in-memory storage for testing
    localStorage: new OAuth.MemoryStorage()
};

// these are set by env.js in production
global.YTENV_TWINTIP_BASE_URL = '';
global.YTENV_KIO_BASE_URL = '';
global.YTENV_MINT_BASE_URL = '';
global.YTENV_OAUTH_CLIENT_ID = '';
global.YTENV_OAUTH_AUTH_URL = '';
global.YTENV_OAUTH_REDIRECT_URI = '';
global.YTENV_OAUTH_SCOPES = '';
