/* globals Mitm, expect */
import ResourceActions from 'common/src/data/resource/resource-actions';

const RES_ID = 'customer',
      SCP_ID = 'read';

function assertOAuthHeader(req) {
    expect(req.headers.authorization).to.be.defined;
    expect(req.headers.authorization).to.equal('Bearer access_token');
}

describe('The resource actions', () => {
    var actions,
        mitm;

    beforeEach(() => {
        mitm = Mitm();
        actions = new ResourceActions();
    });
    afterEach(() => {
        mitm.disable();
    });

    describe('should have oauth enabled', () => {
        it('#fetchAllScopes', () => {
            mitm.on('request', assertOAuthHeader);
            actions.fetchAllScopes();
        });

        it('#fetchScopes', () => {
            mitm.on('request', assertOAuthHeader);
            actions.fetchScopes(RES_ID);
        });

        it('#saveResource', () => {
            mitm.on('request', assertOAuthHeader);
            actions.saveResource(RES_ID, {});
        });

        it('#saveScope', () => {
            mitm.on('request', assertOAuthHeader);
            actions.saveScope(RES_ID, SCP_ID, {});
        });

        it('#fetchResource', () => {
            mitm.on('request', assertOAuthHeader);
            actions.fetchResource(RES_ID);
        });

        it('#fetchResources', () => {
            mitm.on('request', assertOAuthHeader);
            actions.fetchResources();
        });

        it('#fetchScope', () => {
            mitm.on('request', assertOAuthHeader);
            actions.fetchScope(RES_ID, SCP_ID);
        });

        it('#fetchScopeApplications', () => {
            mitm.on('request', assertOAuthHeader);
            actions.fetchScopeApplications(RES_ID, SCP_ID);
        });
    });
});