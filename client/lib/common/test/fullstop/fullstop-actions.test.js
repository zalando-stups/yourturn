/* globals Mitm, expect */
import {
    fetchViolations,
    fetchViolation,
    resolveViolation
} from 'common/src/data/fullstop/fullstop-actions';

function assertOAuthHeader(req) {
    expect(req.headers.authorization).to.be.defined;
    expect(req.headers.authorization).to.equal('Bearer access_token');
}

describe('The fullstop actions', () => {
    var mitm;

    beforeEach(() => {
        mitm = Mitm();
    });

    afterEach(() => {
        mitm.disable();
    });

    describe('should have oauth enabled', () => {
        it('#fetchViolations', () => {
            mitm.on('request', assertOAuthHeader);
            fetchViolations([]);
        });

        it('#fetchViolation', () => {
            mitm.on('request', assertOAuthHeader);
            fetchViolation(123);
        });

        it('#resolveViolation', () => {
            mitm.on('request', assertOAuthHeader);
            resolveViolation(1, '');
        });
    });
});
