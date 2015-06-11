var chai = require('chai'),
    sinon = require('sinon'),
    jsdom = require('jsdom'),
    HTML = '<!doctype html><html><body></body></html>',
    React = require('react/addons'),
    TestUtils = require('react-testutils-additions'),
    Mitm = require('mitm'),
    OAuth = require('oauth2-client-js'),
    localStorage = new OAuth.MemoryStorage();

// necessary because when React is loaded it looks for a window
// if it's not available, this result is stored
// however we create a virtual window further down
// so override that
// 
// http://stackoverflow.com/a/26872245
require('react/lib/ExecutionEnvironment').canUseDOM = true;

TestUtils.findRenderedDOMComponentWithAttributeValue = function(component, attr, val) {
    var doms = TestUtils.scryRenderedDOMComponentsWithAttributeValue(component, attr, val);
    if (doms.length > 1) {
        throw new Error('findRenderedDOMComponentWithAttributeValue encountered more than one element');
    }
    if (doms.length === 0) {
        throw new Error('findRenderedDOMComponentWithAttributeValue did not find any element');
    }
    return doms[0];
}

localStorage.set('stups-access_token', 'access_token');
global.window = {
    localStorage: localStorage
};


global.render = function(Component, props) {
    var element = React.createElement(Component, props),
        component;
    try {
        component = TestUtils.renderIntoDocument(element);
    } catch(e) {
        console.log(e.stack);
        throw e;
    }
    return component;
}

global.reset = function(done) {
    jsdom.env(HTML, function(err, wndw) {
        global.window = wndw;
        global.document = wndw.document;
        global.$ = require('jquery'); // needs a document
        // OAuth Provider uses localStorage by default
        // so we feed it the in-memory storage for testing
        global.window.localStorage = localStorage;
        global.navigator = {
            userAgent: 'mocha'
        };
        console.debug = console.log.bind(console);
        console.error = console.log.bind(console);
        done();
    });
}

// globals for tests
global.sinon = sinon;
global.expect = chai.expect;
global.Mitm = Mitm;
global.TestUtils = TestUtils;
global.React = React;
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
global.YTENV_RESOURCE_WHITELIST = '';