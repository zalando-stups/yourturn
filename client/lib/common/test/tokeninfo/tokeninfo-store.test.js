/* globals expect */
import TokeninfoStore from 'common/src/data/tokeninfo/tokeninfo-store';
import TokeninfoActions from 'common/src/data/tokeninfo/tokeninfo-actions';
import {Flummox} from 'flummox';

const FLUX = 'tokeninfo';

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions(FLUX, TokeninfoActions);
        this.createStore(FLUX, TokeninfoStore, this);
    }
}

describe('The tokeninfo store', () => {
    var store,
        flux = new MockFlux();

    beforeEach(() => {
        store = flux.getStore(FLUX);
    });

    afterEach(() => {
        store._empty();
    });

    it('should receive a tokeninfo', () => {
        store.receiveTokenInfo(['token', {
            uid: 'npiccolotto'
        }]);
        let tokeninfo = store.getTokenInfo('token');
        expect(tokeninfo.uid).to.equal('npiccolotto');
    });
});