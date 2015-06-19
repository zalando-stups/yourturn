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
    TEAMS = [{
        id: 'stups'
    }];

describe('The oauth token validation', () => {
    var flux,
        TEST_TOKEN,
        TEST_TEAMS;

    function mock() {
        sinon.stub(flux.getActions('user'), 'fetchTokenInfo', () => Promise.resolve(TEST_TOKEN));
        sinon.stub(flux.getActions('user'), 'fetchUserTeams', () => Promise.resolve(TEST_TEAMS));
        sinon.stub(flux.getStore('user'), 'getTokenInfo', () => TEST_TOKEN);
        sinon.stub(flux.getStore('user'), 'getUserTeams', () => TEST_TEAMS);
    }

    beforeEach(() => {
        flux = new MockFlux();
    });

    it('should work in happy case', done => {
        TEST_TOKEN = TOKEN;
        TEST_TEAMS = TEAMS;
        mock();

        validateResponse(flux)
        .then(() => done())
        .catch(done);
    });

    it('should deny if there is no uid in token', done => {
        TEST_TOKEN = _.extend({}, TOKEN);
        delete TEST_TOKEN.uid;
        TEST_TEAMS = TEAMS;
        mock();

        validateResponse(flux)
        .then(() => done(1))
        .catch(() => done());
    });

    it('should deny if there is no realm in token', done => {
        TEST_TOKEN = _.extend({}, TOKEN);
        delete TEST_TOKEN.realm;
        TEST_TEAMS = TEAMS;
        mock();

        validateResponse(flux)
        .then(() => done(1))
        .catch(() => done());
    });

    it('should deny if the realm is something else than employees', done => {
        TEST_TOKEN = _.extend({}, TOKEN);
        TEST_TOKEN.realm = 'services';
        TEST_TEAMS = TEAMS;
        mock();

        validateResponse(flux)
        .then(() => done(1))
        .catch(() => done());
    });

    it('should allow if the realm is /employees', done => {
        TEST_TOKEN = _.extend({}, TOKEN);
        TEST_TOKEN.realm = '/employees';
        TEST_TEAMS = TEAMS;
        mock();

        validateResponse(flux)
        .then(() => done())
        .catch(done);
    });

    it('should deny if user is not in any team', done => {
        TEST_TOKEN = TOKEN;
        TEST_TEAMS = [];
        mock();

        validateResponse(flux)
        .then(() => done(1))
        .catch(() => done());
    });
});