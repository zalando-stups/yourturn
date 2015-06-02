/* globals Mitm, expect */
import MintActions from 'common/src/data/mint/mint-actions';

const APP_ID = 'kio';

function assertOAuthHeader(req) {
    expect(req.headers.authorization).to.be.defined;
    expect(req.headers.authorization).to.equal('Bearer access_token');
}

describe('The mint actions', () => {
    var actions,
        mitm;

    beforeEach(() => {
        mitm = Mitm();
        actions = new MintActions();
    });
    afterEach(() => {
        mitm.disable();
    });

    describe('should have oauth enabled', () => {
        it('#fetchOAuthConfig', () => {
            mitm.on('request', assertOAuthHeader);
            actions.fetchOAuthConfig(APP_ID);
        });

        it('#saveOAuthConfig', () => {
            mitm.on('request', assertOAuthHeader);
            actions.saveOAuthConfig(APP_ID, {});
        });
    });
});