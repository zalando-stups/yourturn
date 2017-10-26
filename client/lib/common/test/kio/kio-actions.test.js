/* globals Mitm, expect */
import {
    fetchApplications,
    fetchApplication,
    saveApplication
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

        it('#fetchApplications', () => {
            mitm.on('request', assertOAuthHeader);
            fetchApplications();
        });

        it('#fetchApplication', () => {
            mitm.on('request', assertOAuthHeader);
            fetchApplication(APP_ID);
        });
    });
});
