/* globals Mitm, expect */
import TeamActions from 'common/src/data/team/team-actions';

function assertOAuthHeader(req) {
    expect(req.headers.authorization).to.be.defined;
    expect(req.headers.authorization).to.equal('Bearer access_token');
}

describe('The pierone actions', () => {
    var actions,
        mitm;

    beforeEach(() => {
        mitm = Mitm();
        actions = new TeamActions();
    });

    afterEach(() => {
        mitm.disable();
    });

    describe('should have oauth enabled', () => {
        it('#fetchAccounts', () => {
            mitm.on('request', assertOAuthHeader);
            actions.fetchAccounts();
        });
    });
});