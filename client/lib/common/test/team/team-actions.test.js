/* globals Mitm, expect */
import TeamActions from 'common/src/data/team/team-actions';

const USR_ID = 'npiccolotto';

function assertOAuthHeader(req) {
    expect(req.headers.authorization).to.be.defined;
    expect(req.headers.authorization).to.equal('Bearer access_token');
}

describe('The team actions', () => {
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
        it('#fetchTeams', () => {
            mitm.on('request', assertOAuthHeader);
            actions.fetchTeams();
        });

        it('#fetchUserTeams', () => {
            mitm.on('request', assertOAuthHeader);
            actions.fetchUserTeams(USR_ID);
        });
    });
});