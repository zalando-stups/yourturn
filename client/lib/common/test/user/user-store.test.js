/* globals expect */
import UserStoreWrapper, {UserStore} from 'common/src/data/user/user-store';
import UserActions from 'common/src/data/user/user-actions';
import Types from 'common/src/data/user/user-types';
import {Flummox} from 'flummox';

const FLUX = 'user',
    TEST_ACCOUNTS = [{
        id: '123',
        name: 'stups'
    }, {
        id: '321',
        name: 'greendale'
    }],
    TEST_USERINFO = {
        email: 'test@example.com'
    };

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions(FLUX, UserActions);
        this.createStore(FLUX, UserStoreWrapper, this);
    }
}

describe('The user redux store', () => {
    it('should receive a tokeninfo', () => {
        let state = UserStore();
        state = UserStore(state, {
            type: Types.RECEIVE_TOKENINFO,
            payload: {
                uid: 'npiccolotto'
            }
        });
        let tokeninfo = state.get('tokeninfo').toJS();
        expect(tokeninfo).to.be.ok;
        expect(tokeninfo.uid).to.equal('npiccolotto');
    });

    it('should delete a tokeninfo', () => {
        let state = UserStore();
        state = UserStore(state, {
            type: Types.RECEIVE_TOKENINFO,
            payload: {
                uid: 'npiccolotto'
            }
        });
        state = UserStore(state, {
            type: Types.DELETE_TOKENINFO
        });
        expect(state.get('tokeninfo')).to.be.false;
    });

    it('should receive cloud accounts of a user', () => {
        let state = UserStore();
        state = UserStore(state, {
            type: Types.RECEIVE_ACCOUNTS,
            payload: TEST_ACCOUNTS
        });
        expect(state.get('accounts').count()).to.equal(2);
    });

    it('should receive userinfo', () => {
        let state = UserStore();
        state = UserStore(state, {
            type: Types.RECEIVE_USERINFO,
            payload: ['test', TEST_USERINFO]
        });
        let info = state.getIn(['users', 'test']);
        expect(info).to.be.ok;
        expect(info.get('email')).to.equal(TEST_USERINFO.email);
    });
});

describe('The user store', () => {
    var store,
        flux = new MockFlux();

    beforeEach(() => {
        store = flux.getStore(FLUX);
    });

    afterEach(() => {
        store._empty();
    });

    it('should receive a tokeninfo', () => {
        store.receiveTokenInfo({
            uid: 'npiccolotto'
        });
        let tokeninfo = store.getTokenInfo();
        expect(tokeninfo.uid).to.equal('npiccolotto');
    });

    it('should delete a tokeninfo', () => {
        store.receiveTokenInfo({
            uid: 'npiccolotto'
        });
        store.deleteTokenInfo();
        expect(store.getTokenInfo()).to.be.false;
    });

    it('should return cloud accounts of a user', () => {
        store.receiveAccounts(TEST_ACCOUNTS);
        let accounts = store.getUserCloudAccounts();
        expect(accounts.length).to.equal(2);
    });

    it('should return userinfo for a user', () => {
        store.receiveUserInfo(['test', TEST_USERINFO]);
        let info = store.getUserInfo('test');
        expect(info).to.be.ok;
        expect(info.email).to.equal(TEST_USERINFO.email);
    });

    it('should return userinfo for the current user', () => {
        store.receiveTokenInfo({
            uid: 'test'
        });
        store.receiveUserInfo(['test', TEST_USERINFO]);
        let info = store.getUserInfo();
        expect(info).to.be.ok;
        expect(info.email).to.equal(TEST_USERINFO.email);
    });
});
