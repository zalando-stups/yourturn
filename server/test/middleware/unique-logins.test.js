'use strict';

const sinon = require('sinon');
const winston = require('winston');

const uniqueLogins = require('../../src/middleware/unique-logins');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('middleware/unique-logins', () => {
    let store, storeMock, next;

    before(() => {
        store = {
            add(item) { throw new Error('unexpected call'); },
            get size() { throw new Error('unexpected call'); },
            get items() { throw new Error('unexpected call'); }
        };
    });

    beforeEach(() => {
        storeMock = sinon.mock(store);
        next = sinon.spy();
    });

    it('should do nothing if there is no tokeninfo in request', () => {
        const middleware = uniqueLogins(store);
        middleware({}, {}, next);

        return delay(100)
            .then(() => {
                expect(next.calledOnce).to.be.true;
            });
    });

    it('should do nothing if tokeninfo is in request but is empty', () => {
        const middleware = uniqueLogins(store);
        middleware({ tokeninfo: {} }, {}, next);

        return delay(100)
            .then(() => {
                expect(next.calledOnce).to.be.true;
            })
    });

    it('should add token to store if tokeninfo is in request', () => {
        const middleware = uniqueLogins(store);

        storeMock.expects('add').once().withExactArgs('/realm/uid')
            .returns(Promise.resolve());

        middleware({
            tokeninfo: {
                realm: '/realm',
                uid: 'uid'
            }
        }, {}, next);

        return delay(100)
            .then(() => {
                storeMock.verify();
                expect(next.calledOnce).to.be.true;
            });
    });
});
