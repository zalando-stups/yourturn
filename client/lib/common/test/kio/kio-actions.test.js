/* globals Mitm, expect */
import KioActions from 'common/src/data/kio/kio-actions';

const APP_ID = 'kio',
      VER_ID = '0.1';

function assertOAuthHeader(req) {
    expect(req.headers.authorization).to.be.defined;
    expect(req.headers.authorization).to.equal('Bearer access_token');
}

describe('The kio actions', () => {
    var actions,
        mitm;

    beforeEach(() => {
        mitm = Mitm();
        actions = new KioActions();
    });
    afterEach(() => {
        mitm.disable();
    });

    describe('should have oauth enabled', () => {
        it('#saveApplication', () => {
            mitm.on('request', assertOAuthHeader);
            actions.saveApplication(APP_ID);
        });

        it('#fetchApplications', () => {
            mitm.on('request', assertOAuthHeader);
            actions.fetchApplications();
        });

        it('#fetchApplication', () => {
            mitm.on('request', assertOAuthHeader);
            actions.fetchApplication(APP_ID);
        });

        it('#fetchApplicationVersions', () => {
            mitm.on('request', assertOAuthHeader);
            actions.fetchApplicationVersions(APP_ID);
        });

        it('#fetchApplicationVersion', () => {
            mitm.on('request', assertOAuthHeader);
            actions.fetchApplicationVersion(APP_ID, VER_ID);
        });

        it('#saveApplicationVersion', () => {
            mitm.on('request', assertOAuthHeader);
            actions.saveApplicationVersion(APP_ID, VER_ID, {});
        });

        it('#fetchApprovalTypes', () => {
            mitm.on('request', assertOAuthHeader);
            actions.fetchApprovalTypes(APP_ID);
        });

        it('#fetchApprovals', () => {
            mitm.on('request', assertOAuthHeader);
            actions.fetchApprovals(APP_ID, VER_ID);
        });

        it('#saveApproval', () => {
            mitm.on('request', assertOAuthHeader);
            actions.saveApproval(APP_ID, VER_ID, {});
        });
    });
});