/* globals sinon */
import {Flummox} from 'flummox';
import _ from 'lodash';
import UserStore from 'common/src/data/user/user-store';
import UserActions from 'common/src/data/user/user-actions';
import validateResponse from 'yourturn/src/validate-oauth-response';

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions('user', UserActions);
        this.createStore('user', UserStore, this);
    }
}

const TOKEN = {
        uid: 'npiccolotto',
        realm: 'employees'
    },
    ACCOUNTS = [{
        id: 'stups'
    }];

describe('The oauth token validation', () => {
    var flux,
        TEST_TOKEN,
        TEST_ACCOUNTS;

    function mock() {
        sinon.stub(flux.getActions('user'), 'fetchTokenInfo', () => Promise.resolve(TEST_TOKEN));
        sinon.stub(flux.getStore('user'), 'getTokenInfo', () => TEST_TOKEN);
        sinon.stub(flux.getActions('user'), 'fetchAccounts', () => Promise.resolve(TEST_ACCOUNTS));
        sinon.stub(flux.getStore('user'), 'getUserCloudAccounts', () => TEST_ACCOUNTS);
    }

    beforeEach(() => {
        flux = new MockFlux();
        TEST_TOKEN = TOKEN;
        TEST_ACCOUNTS = ACCOUNTS;
    });

    it('should work in happy case', done => {
        mock();

        validateResponse(flux)
        .then(() => done())
        .catch(done);
    });

    it('should deny if there is no uid in token', done => {
        TEST_TOKEN = _.extend({}, TOKEN);
        delete TEST_TOKEN.uid;
        mock();

        validateResponse(flux)
        .then(() => done(1))
        .catch(() => done());
    });

    it('should deny if there is no realm in token', done => {
        TEST_TOKEN = _.extend({}, TOKEN);
        delete TEST_TOKEN.realm;
        mock();

        validateResponse(flux)
        .then(() => done(1))
        .catch(() => done());
    });

    it('should deny if the realm is something else than employees', done => {
        TEST_TOKEN = _.extend({}, TOKEN);
        TEST_TOKEN.realm = 'services';
        mock();

        validateResponse(flux)
        .then(() => done(1))
        .catch(() => done());
    });

    it('should allow if the realm is /employees', done => {
        TEST_TOKEN = _.extend({}, TOKEN);
        TEST_TOKEN.realm = '/employees';
        mock();

        validateResponse(flux)
        .then(() => done())
        .catch(done);
    });

    it('should deny if user is not in any team', done => {
        TEST_ACCOUNTS = [];
        mock();

        validateResponse(flux)
        .then(() => done(1))
        .catch(() => done());
    });
});
