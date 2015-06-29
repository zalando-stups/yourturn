/* globals expect */
import UserStore from 'common/src/data/user/user-store';
import UserActions from 'common/src/data/user/user-actions';
import {Flummox} from 'flummox';

const FLUX = 'user',
    TEST_TEAMS = [{
        id: 'stups',
        name: 'stups',
        'infrastructure-accounts': [{
            id: '74129824892479',
            type: 'aws'
        }]
    }, {
        id: 'greendale',
        name: 'greendale',
        'infrastructure-accounts': [{
            id: '8575378539035035',
            type: 'gcc'
        }]
    }],
    TEST_USERINFO = {
        email: 'test@example.com'
    };

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions(FLUX, UserActions);
        this.createStore(FLUX, UserStore, this);
    }
}

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

    it('should return teams without their accounts', () => {
        store.receiveUserTeams(TEST_TEAMS);
        let userTeams = store.getUserTeams();
        expect(userTeams[0]['infrastructure-accounts']).to.not.be.ok;
    });

    it('should return cloud accounts of a user', () => {
        store.receiveUserTeams(TEST_TEAMS);
        let accounts = store.getUserCloudAccounts();
        expect(accounts.length).to.equal(2);
    });

    it('should sort teams', () => {
        store.receiveUserTeams(TEST_TEAMS);
        let userTeams = store.getUserTeams();
        expect(userTeams.length).to.equal(2);
        expect(userTeams[0].id).to.equal('greendale');
    });

    it('should return userinfo for a user', () => {
        store.receiveUserInfo('test', TEST_USERINFO);
        let info = store.getUserInfo('test');
        expect(info).to.be.ok;
        expect(info.email).to.equal(TEST_USERINFO.email);
    });

    it('should return userinfo for the current user', () => {
        store.receiveTokenInfo({
            uid: 'test'
        });
        store.receiveUserInfo('test', TEST_USERINFO);
        let info = store.getUserInfo();
        expect(info).to.be.ok;
        expect(info.email).to.equal(TEST_USERINFO.email);
    });
});
