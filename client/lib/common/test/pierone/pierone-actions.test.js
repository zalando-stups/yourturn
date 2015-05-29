/* globals Mitm, expect */
import PieroneActions from 'common/src/data/pierone/pierone-actions';

const TEAM = 'stups',
    ARTIFACT = 'kio',
    TAG = '1.0';

function assertOAuthHeader(req) {
    expect(req.headers.authorization).to.be.defined;
    expect(req.headers.authorization).to.equal('Bearer access_token');
}

describe('The pierone actions', () => {
    var actions,
        mitm;

    beforeEach(() => {
        mitm = Mitm();
        actions = new PieroneActions();
    });
    afterEach(() => {
        mitm.disable();
    });

    describe('should have oauth enabled', () => {
        it('#fetchScmSource', () => {
            mitm.on('request', assertOAuthHeader);
            actions.fetchScmSource(TEAM, ARTIFACT, TAG);
        });

        it('#fetchTags', () => {
            mitm.on('request', assertOAuthHeader);
            actions.fetchTags(TEAM, ARTIFACT);
        });
    });
});