/* globals Mitm, expect */
import {
    fetchAllScopes,
    fetchScopes,
    saveResource,
    saveScope,
    fetchResource,
    fetchResources,
    fetchScope,
    fetchScopeApplications
} from 'common/src/data/essentials/essentials-actions';

const RES_ID = 'customer',
      SCP_ID = 'read';

function assertOAuthHeader(req) {
    expect(req.headers.authorization).to.be.defined;
    expect(req.headers.authorization).to.equal('Bearer access_token');
}

describe('The essentials actions', () => {
    var mitm;

    beforeEach(() => {
        mitm = Mitm();
    });
    afterEach(() => {
        mitm.disable();
    });

    describe('should have oauth enabled', () => {
        it('#fetchAllScopes', () => {
            mitm.on('request', assertOAuthHeader);
            fetchAllScopes();
        });

        it('#fetchScopes', () => {
            mitm.on('request', assertOAuthHeader);
            fetchScopes(RES_ID);
        });

        it('#saveResource', () => {
            mitm.on('request', assertOAuthHeader);
            saveResource(RES_ID, {});
        });

        it('#saveScope', () => {
            mitm.on('request', assertOAuthHeader);
            saveScope(RES_ID, SCP_ID, {});
        });

        it('#fetchResource', () => {
            mitm.on('request', assertOAuthHeader);
            fetchResource(RES_ID);
        });

        it('#fetchResources', () => {
            mitm.on('request', assertOAuthHeader);
            fetchResources();
        });

        it('#fetchScope', () => {
            mitm.on('request', assertOAuthHeader);
            fetchScope(RES_ID, SCP_ID);
        });

        it('#fetchScopeApplications', () => {
            mitm.on('request', assertOAuthHeader);
            fetchScopeApplications(RES_ID, SCP_ID);
        });
    });
});