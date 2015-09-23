/* globals Mitm, expect */
import {
    fetchApplications,
    fetchApplication,
    saveApplication,
    saveApplicationCriticality,
    fetchApplicationVersions,
    fetchApplicationVersion,
    saveApplicationVersion,
    fetchApprovalTypes,
    fetchApprovals,
    saveApproval
} from 'common/src/data/kio/kio-actions';

const APP_ID = 'kio',
      VER_ID = '0.1';

function assertOAuthHeader(req) {
    expect(req.headers.authorization).to.be.defined;
    expect(req.headers.authorization).to.equal('Bearer access_token');
}

describe('The kio actions', () => {
    var mitm;

    beforeEach(() => {
        mitm = Mitm();
    });

    afterEach(() => {
        mitm.disable();
    });

    describe('should have oauth enabled', () => {
        it('#saveApplication', () => {
            mitm.on('request', assertOAuthHeader);
            saveApplication(APP_ID);
        });

        it('#saveApplicationCriticality', () => {
            mitm.on('request', assertOAuthHeader);
            saveApplicationCriticality(APP_ID);
        });

        it('#fetchApplications', () => {
            mitm.on('request', assertOAuthHeader);
            fetchApplications();
        });

        it('#fetchApplication', () => {
            mitm.on('request', assertOAuthHeader);
            fetchApplication(APP_ID);
        });

        it('#fetchApplicationVersions', () => {
            mitm.on('request', assertOAuthHeader);
            fetchApplicationVersions(APP_ID);
        });

        it('#fetchApplicationVersion', () => {
            mitm.on('request', assertOAuthHeader);
            fetchApplicationVersion(APP_ID, VER_ID);
        });

        it('#saveApplicationVersion', () => {
            mitm.on('request', assertOAuthHeader);
            saveApplicationVersion(APP_ID, VER_ID, {});
        });

        it('#fetchApprovalTypes', () => {
            mitm.on('request', assertOAuthHeader);
            fetchApprovalTypes(APP_ID);
        });

        it('#fetchApprovals', () => {
            mitm.on('request', assertOAuthHeader);
            fetchApprovals(APP_ID, VER_ID);
        });

        it('#saveApproval', () => {
            mitm.on('request', assertOAuthHeader);
            saveApproval(APP_ID, VER_ID, {});
        });
    });
});
