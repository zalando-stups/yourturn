/* globals Mitm, expect */
import FullstopActions from 'common/src/data/fullstop/fullstop-actions';

function assertOAuthHeader(req) {
    expect(req.headers.authorization).to.be.defined;
    expect(req.headers.authorization).to.equal('Bearer access_token');
}

describe('The fullstop actions', () => {
    var actions,
        mitm;

    beforeEach(() => {
        mitm = Mitm();
        actions = new FullstopActions();
    });
    afterEach(() => {
        mitm.disable();
    });

    describe('should have oauth enabled', () => {
        it('#fetchViolations', () => {
            mitm.on('request', assertOAuthHeader);
            actions.fetchViolations([]);
        });

        it('#resolveViolation', () => {
            mitm.on('request', assertOAuthHeader);
            actions.resolveViolation(1, {}, '');
        });
    });
});