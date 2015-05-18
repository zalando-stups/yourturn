/* globals expect */
import UserStore from 'common/src/data/user/user-store';
import UserActions from 'common/src/data/user/user-actions';
import {Flummox} from 'flummox';

const FLUX = 'user';

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
});