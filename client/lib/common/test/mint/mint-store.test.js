/* globals expect */
import MintStoreWrapper, {MintStore} from 'common/src/data/mint/mint-store';
import MintActions from 'common/src/data/mint/mint-actions';
import Types from 'common/src/data/mint/mint-types';
import * as Getter from 'common/src/data/mint/mint-getter';
import {Flummox} from 'flummox';
import {Pending, Failed} from 'common/src/fetch-result';

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions('mint', MintActions);
        this.createStore('mint', MintStoreWrapper, this);
    }
}

describe('The mint store', () => {
    var store,
        flux = new MockFlux();

    beforeEach(() => {
        store = flux.getStore('mint');
    });

    afterEach(() => {
        store._empty();
    });

    it('should receive a config', () => {
        store.receiveOAuthConfig(['kio', {
            id: 'kio'
        }]);
        let kio = store.getOAuthConfig('kio');
        expect(kio).to.not.be.undefined;
        expect(kio instanceof Pending).to.be.false;
        expect(kio instanceof Failed).to.be.false;
        expect(kio.id).to.equal('kio');
    });

    it('should insert a pending fetch result placeholder', () => {
        store.beginFetchOAuthConfig('kio');
        let kio = store.getOAuthConfig('kio');
        expect(kio instanceof Pending).to.be.true;
    });

    it('should insert a failed fetch result placeholder', () => {
        let fetchError = new Error();
        fetchError.id = 'kio';
        store.failFetchOAuthConfig(fetchError);
        let kio = store.getOAuthConfig('kio');
        expect(kio instanceof Failed).to.be.true;
    });
});

describe('The mint redux store', () => {
    it('should receive a config', () => {
        let state = MintStore(MintStore(), {
                type: Types.RECEIVE_OAUTH_CONFIG,
                payload: ['kio', {
                    id: 'kio'
                }]
            }),
            kio = Getter.getOAuthConfig(state, 'kio');
        expect(kio).to.not.be.undefined;
        expect(kio instanceof Pending).to.be.false;
        expect(kio instanceof Failed).to.be.false;
        expect(kio.id).to.equal('kio');
    });

    it('should insert a pending fetch result placeholder', () => {
        let state = MintStore(MintStore(), {
                type: Types.BEGIN_FETCH_OAUTH_CONFIG,
                payload: 'kio'
            }),
            kio = Getter.getOAuthConfig(state, 'kio');
        expect(kio instanceof Pending).to.be.true;
    });

    it('should insert a failed fetch result placeholder', () => {
        let fetchError = new Error();
        fetchError.id = 'kio';
        let state = MintStore(MintStore(), {
                type: Types.FAIL_FETCH_OAUTH_CONFIG,
                payload: fetchError
            }),
            kio = Getter.getOAuthConfig(state, 'kio');
        expect(kio instanceof Failed).to.be.true;
    });
});