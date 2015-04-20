/* globals expect */
window.YTENV_TWINTIP_BASE_URL = 'localhost';
window.YTENV_KIO_BASE_URL = 'localhost';

import ApplicationStore from 'common/src/data/application/application-store';
import ApplicationActions from 'common/src/data/application/application-actions';
import {Flummox} from 'flummox';
import {Pending, Failed} from 'common/src/fetch-result';

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions('application', ApplicationActions);
        this.createStore('application', ApplicationStore, this);
    }
}

describe('The application store', () => {
    let store,
        flux = new MockFlux();

    beforeEach(() => {
        store = flux.getStore('application');
    });

    afterEach(() => {
        store._empty();
    });

    it('should receive applications', () => {
        let results = [{
            id: 'kio'
        }, {
            id: 'twintip'
        }];
        store.receiveApplications(results);
        expect(store.getApplications().length).to.equal(2);
    });

    it('should insert a pending fetch result placeholder', () => {
        store.beginFetchApplication('kio');
        let kio = store.getApplication('kio');
        expect( kio instanceof Pending ).to.be.true;
    });

    it('should insert a failed fetch result placeholder', () => {
        let fetchError = new Error();
        fetchError.id = 'kio';
        store.failFetchApplication(fetchError);
        let kio = store.getApplication('kio');
        expect( kio instanceof Failed ).to.be.true;
    });

    it('should not give out fetch results', () => {
        let results = [{
            id: 'kio'
        }];

        store.receiveApplications(results);
        store.beginFetchApplication('twintip');

        expect(store.getApplications().length).to.equal(1);
    });
});