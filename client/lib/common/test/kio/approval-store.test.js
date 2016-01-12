/* global expect */
import Store from 'common/src/data/kio/kio-store';
import Types from 'common/src/data/kio/kio-types';
import * as Getter from 'common/src/data/kio/kio-getter';
import {Pending, Failed} from 'common/src/fetch-result';

describe('The redux approval store', () => {
    it('should receive approvals', () => {
        let approvals = [{
            application_id: 'kio',
            version_id: '0.12',
            user_id: 'test',
            approval_type: 'TESTED',
            approved_at: '2015-04-26T01:40:17Z'
        }, {
            application_id: 'kio',
            version_id: '0.12',
            user_id: 'test',
            approval_type: 'DEPLOY',
            approved_at: '2015-04-26T01:37:17Z'
        }];

        let state = Store(Store(), {
            type: Types.FETCH_APPROVALS,
            payload: ['kio', '0.12', approvals]
        });
        expect(Getter.getApprovals(state, 'kio', '0.12').length).to.equal(2);
    });

    it('should sort approvals by date asc', () => {
        let results = [{
            application_id: 'kio',
            version_id: '0.12',
            user_id: 'test',
            approval_type: 'TESTED',
            approved_at: '2015-04-26T01:40:17Z'
        }, {
            application_id: 'kio',
            version_id: '0.12',
            user_id: 'test',
            approval_type: 'DEPLOY',
            approved_at: '2015-04-26T01:37:17Z'
        }];
        let state = Store(Store(), {
            type: Types.FETCH_APPROVALS,
            payload: ['kio', '0.12', results]
        })
        let approvals = Getter.getApprovals(state, 'kio', '0.12');
        expect(approvals[0].approval_type).to.equal('DEPLOY');
        expect(approvals[1].approval_type).to.equal('TESTED');
    });

    it('should return an empty array by default', () => {
        expect(Getter.getApprovals(Store(), 'kio', '0.12').length).to.equal(0);
    });
});