/* global global, require */
var chai = require('chai'),
    sinon = require('sinon'),
    domino = require('domino'),
    history = require('history'),
    assign = require('object-assign'),
    HTML = '<!doctype html><html><body></body></html>',
    Mitm = require('mitm'),
    OAuth = require('@zalando/oauth2-client-js'),
    localStorage = new OAuth.MemoryStorage(),
    React,
    TestUtils;

global.window = domino.createWindow(HTML);
global.document = global.window.document;
global.$ = require('jquery'); // needs a document

function reset() {
    localStorage.set('stups-access_token', 'access_token');
    global.window.localStorage = localStorage;
    global.navigator = global.window.navigator;

    React = require('react');
    TestUtils = require('react-testutils-additions');
}

reset();
var RouterStub = assign({}, history.createMemoryHistory());
var Wrapper = function (Component, props) {
    return React.createClass({
        childContextTypes: {
            router: React.PropTypes.object
        },
        getChildContext: function () {
            return {
                router: RouterStub
            };
        },
        render: function () {
            return React.createElement(Component, props);
        }
    });
};

TestUtils.findRenderedDOMComponentWithAttributeValue = function (component, attr, val) {
    var doms = TestUtils.scryRenderedDOMComponentsWithAttributeValue(component, attr, val);
    if (doms.length > 1) {
        throw new Error('More than one element with attribute ' + attr + '=' + val + ' found!');
    }
    if (doms.length === 0) {
        throw new Error('No element with attribute ' + attr + '=' + val + ' found!');
    }
    return doms[0];
};

global.render = function (Component, props) {
    var clazz = Wrapper(Component, props),
        element = React.createElement(clazz),
        component;
    try {
        component = TestUtils.renderIntoDocument(element);
    } catch (e) {
        console.log(e.stack); //eslint-disable-line
        throw e;
    }
    return component;
};

global.reset = reset;

// globals for tests
global.sinon = sinon;
global.expect = chai.expect;
global.Mitm = Mitm;
global.TestUtils = TestUtils;
global.React = React;
global.NODE_ENV = 'TEST';
// these are set by env.js in production
global.YTENV_TWINTIP_BASE_URL = '';
global.YTENV_KIO_BASE_URL = '';
global.YTENV_USER_BASE_URL = '';
global.YTENV_TEAM_BASE_URL = '';
global.YTENV_MINT_BASE_URL = '';
global.YTENV_ESSENTIALS_BASE_URL = '';
global.YTENV_PIERONE_BASE_URL = '';
global.YTENV_FULLSTOP_BASE_URL = '';
global.YTENV_MAGNIFICENT_BASE_URL = '';
global.YTENV_OAUTH_CLIENT_ID = '';
global.YTENV_OAUTH_AUTH_URL = '';
global.YTENV_OAUTH_TOKENINFO_URL = '';
global.YTENV_OAUTH_REDIRECT_URI = '';
global.YTENV_OAUTH_SCOPES = '';
global.YTENV_SERVICE_URL_TLD = '';
global.YTENV_DOCKER_REGISTRY = 'docker.io';
global.YTENV_RESOURCE_WHITELIST = '';
global.YTENV_APPLICATION_WHITELIST = '';
global.YTENV_MINT_BUCKET_TEMPLATE = '';
