var chai = require('chai'),
    sinon = require('sinon');

// globals for tests
global.sinon = sinon;
global.expect = chai.expect;
global.NODE_ENV = 'TEST';
