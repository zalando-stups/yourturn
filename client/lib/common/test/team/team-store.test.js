/* globals expect */
import Store from 'common/src/data/team/team-store';
import Types from 'common/src/data/team/team-types';

const ACCOUNTS = [{
        id: '1029384756',
        name: 'acid',
        type: 'aws',
        description: 'ACID Account'
    },
    {
        id: '123456789',
        name: 'stups',
        type: 'aws',
        description: 'STUPS account'
    },
    {
        id: '0987654321',
        name: 'stups-test',
        type: 'aws',
        description: 'STUPS test account'
    }];

describe('The redux team store', () => {
    it('should receive accounts', () => {
        let state = Store();
        state = Store(state, {
            type: Types.FETCH_ACCOUNTS,
            payload: ACCOUNTS
        });
        expect(state.count()).to.equal(ACCOUNTS.length);
    });
});
