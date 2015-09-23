/* globals Mitm, expect */
import {fetchScmSource, fetchTags} from 'common/src/data/pierone/pierone-actions';

const TEAM = 'stups',
    ARTIFACT = 'kio',
    TAG = '1.0';

function assertOAuthHeader(req) {
    expect(req.headers.authorization).to.be.defined;
    expect(req.headers.authorization).to.equal('Bearer access_token');
}

describe('The pierone actions', () => {
    var mitm;

    beforeEach(() => {
        mitm = Mitm();
    });
    afterEach(() => {
        mitm.disable();
    });

    describe('should have oauth enabled', () => {
        it('#fetchScmSource', () => {
            mitm.on('request', assertOAuthHeader);
            fetchScmSource(TEAM, ARTIFACT, TAG);
        });

        it('#fetchTags', () => {
            mitm.on('request', assertOAuthHeader);
            fetchTags(TEAM, ARTIFACT);
        });
    });
});