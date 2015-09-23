/* globals Mitm, expect */
import {
    renewCredentials,
    saveOAuthConfig,
    fetchOAuthConfig
} from 'common/src/data/mint/mint-actions';

const APP_ID = 'kio';

function assertOAuthHeader(req) {
    expect(req.headers.authorization).to.be.defined;
    expect(req.headers.authorization).to.equal('Bearer access_token');
}

describe('The mint actions', () => {
    var mitm;

    beforeEach(() => {
        mitm = Mitm();
    });
    afterEach(() => {
        mitm.disable();
    });

    describe('should have oauth enabled', () => {
        it('#fetchOAuthConfig', () => {
            mitm.on('request', assertOAuthHeader);
            fetchOAuthConfig(APP_ID);
        });

        it('#saveOAuthConfig', () => {
            mitm.on('request', assertOAuthHeader);
            saveOAuthConfig(APP_ID, {});
        });

        it('#renewCredentials', () => {
            mitm.on('request', assertOAuthHeader);
            renewCredentials(APP_ID);
        });
    });
});