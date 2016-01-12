/* globals sinon */
import _ from 'lodash';
import * as UserActions from 'common/src/data/user/user-actions';
import validateResponse from 'yourturn/src/validate-oauth-response';

const TOKEN = {
        uid: 'npiccolotto',
        realm: 'employees'
    };

describe('The oauth token validation', () => {
    var TEST_TOKEN,
        userActions;

    function mock() {
        userActions = Object.assign({}, UserActions);
        sinon.stub(userActions, 'fetchTokenInfo', () => Promise.resolve(TEST_TOKEN));
    }

    beforeEach(() => {
        TEST_TOKEN = Object.assign({}, TOKEN);
        mock();
    });

    it('should work in happy case', done => {
        validateResponse(userActions)
        .then(() => done())
        .catch(done);
    });

    it('should deny if there is no uid in token', done => {
        delete TEST_TOKEN.uid;
        mock();

        validateResponse(userActions)
        .then(() => done(1))
        .catch(() => done());
    });

    it('should deny if there is no realm in token', done => {
        delete TEST_TOKEN.realm;
        mock();

        validateResponse(userActions)
        .then(() => done(1))
        .catch(() => done());
    });

    it('should deny if the realm is something else than employees', done => {
        TEST_TOKEN.realm = 'services';
        mock();

        validateResponse(userActions)
        .then(() => done(1))
        .catch(() => done());
    });

    it('should allow if the realm is /employees', done => {
        TEST_TOKEN.realm = '/employees';
        mock();

        validateResponse(userActions)
        .then(() => done())
        .catch(done);
    });
});
