/* globals expect */
import Store from 'common/src/data/user/user-store';
import Types from 'common/src/data/user/user-types';

const TEST_ACCOUNTS = [{
        id: '123',
        name: 'stups'
    }, {
        id: '321',
        name: 'greendale'
    }],
    TEST_USERINFO = {
        email: 'test@example.com'
    };

describe('The user redux store', () => {
    it('should receive a tokeninfo', () => {
        let state = Store();
        state = Store(state, {
            type: Types.FETCH_TOKENINFO,
            payload: {
                uid: 'npiccolotto'
            }
        });
        let tokeninfo = state.get('tokeninfo').toJS();
        expect(tokeninfo).to.be.ok;
        expect(tokeninfo.uid).to.equal('npiccolotto');
    });

    it('should delete a tokeninfo', () => {
        let state = Store();
        state = Store(state, {
            type: Types.FETCH_TOKENINFO,
            payload: {
                uid: 'npiccolotto'
            }
        });
        state = Store(state, {
            type: Types.DELETE_TOKENINFO
        });
        expect(state.get('tokeninfo')).to.be.false;
    });

    it('should receive cloud accounts of a user', () => {
        let state = Store();
        state = Store(state, {
            type: Types.FETCH_USERACCOUNTS,
            payload: TEST_ACCOUNTS
        });
        expect(state.get('accounts').count()).to.equal(2);
    });

    it('should receive userinfo', () => {
        let state = Store();
        state = Store(state, {
            type: Types.FETCH_USERINFO,
            payload: ['test', TEST_USERINFO]
        });
        let info = state.getIn(['users', 'test']);
        expect(info).to.be.ok;
        expect(info.get('email')).to.equal(TEST_USERINFO.email);
    });
});
