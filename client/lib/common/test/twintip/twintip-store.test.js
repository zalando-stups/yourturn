/* globals expect */
import TwintipStoreWrapper, {TwintipStore} from 'common/src/data/twintip/twintip-store';
import TwintipActions from 'common/src/data/twintip/twintip-actions';
import * as Types from 'common/src/data/twintip/twintip-types';
import {Flummox} from 'flummox';
import {Pending, Failed} from 'common/src/fetch-result';

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions('twintip', TwintipActions);
        this.createStore('twintip', TwintipStoreWrapper, this);
    }
}

describe('The twintip redux store', () => {
    it('should receive an api', () => {
        let state = TwintipStore();
        state = TwintipStore(state, {
            type: Types.RECEIVE_API,
            payload: {
                application_id: 'kio'
            }
        });
        expect(state.valueSeq().count()).to.equal(1);
    });

    it('should insert a pending fetch result placeholder', () => {
        let state = TwintipStore();
        state = TwintipStore(state, {
            type: Types.BEGIN_FETCH_API,
            payload: 'kio'
        });
        expect(state.get('kio') instanceof Pending).to.be.true;
    });

    it('should insert a failed fetch result placeholder', () => {
        let fetchError = new Error();
        fetchError.id = 'kio';
        let state = TwintipStore();
        state = TwintipStore(state, {
            type: Types.FAIL_FETCH_API,
            payload: fetchError
        });
        expect(state.get('kio') instanceof Failed).to.be.true;
    });
});

describe('The twintip store', () => {
    var store,
        flux = new MockFlux();

    beforeEach(() => {
        store = flux.getStore('twintip');
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
        expect(kio instanceof Pending).to.be.true;
    });

    it('should insert a failed fetch result placeholder', () => {
        let fetchError = new Error();
        fetchError.id = 'kio';
        store.failFetchApi(fetchError);
        let kio = store.getApi('kio');
        expect(kio instanceof Failed).to.be.true;
    });
});