/* globals Mitm, expect */
import {fetchAccounts} from 'common/src/data/team/team-actions';

function assertOAuthHeader(req) {
    expect(req.headers.authorization).to.be.defined;
    expect(req.headers.authorization).to.equal('Bearer access_token');
}

describe('The team actions', () => {
    var mitm;

    beforeEach(() => {
        mitm = Mitm();
    });

    afterEach(() => {
        mitm.disable();
    });

    describe('should have oauth enabled', () => {
        it('#fetchAccounts', () => {
            mitm.on('request', assertOAuthHeader);
            fetchAccounts();
        });
    });
});