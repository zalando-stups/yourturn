/* globals Mitm, expect */
import {
    fetchAllClusters
} from 'common/src/data/clusters/clusters-actions';

function assertOAuthHeader(req) {
    expect(req.headers.authorization).to.be.defined;
    expect(req.headers.authorization).to.equal('Bearer access_token');
}

describe('The clusters actions', () => {
    var mitm;

    beforeEach(() => {
        mitm = Mitm();
    });
    afterEach(() => {
        mitm.disable();
    });

    describe('should have oauth enabled', () => {
        it('#fetchAllClusters', () => {
            mitm.on('request', assertOAuthHeader);
            fetchAllClusters();
        });
    });
});