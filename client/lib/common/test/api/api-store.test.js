/* globals expect */
window.YTENV_TWINTIP_BASE_URL = 'localhost';
window.YTENV_KIO_BASE_URL = 'localhost';
window.YTENV_MINT_BASE_URL = 'localhost';

import ApiStore from 'common/src/data/api/api-store';
import ApiActions from 'common/src/data/api/api-actions';
import {Flummox} from 'flummox';
import {Pending, Failed} from 'common/src/fetch-result';

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions('api', ApiActions);
        this.createStore('api', ApiStore, this);
    }
}

describe('The api store', () => {
    var store,
        flux = new MockFlux();

    beforeEach(() => {
        store = flux.getStore('api');
    });

    afterEach(() => {
        store._empty();
    });

    it('should receive an api', () => {
        store.receiveApi({
            application_id: 'kio'
        });
        expect(store.getApi('kio')).to.not.be.undefined;
        expect(store.getApi('twintip')).to.not.be.undefined;
    });

    it('should insert a pending fetch result placeholder', () => {
        store.beginFetchApi('kio');
        let kio = store.getApi('kio');
        expect( kio instanceof Pending ).to.be.true;
    });

    it('should insert a failed fetch result placeholder', () => {
        let fetchError = new Error();
        fetchError.id = 'kio';
        store.failFetchApi(fetchError);
        let kio = store.getApi('kio');
        expect( kio instanceof Failed ).to.be.true;
    });
});