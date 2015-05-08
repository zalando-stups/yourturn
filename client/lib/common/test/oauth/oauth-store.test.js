/* globals expect */
import OAuthStore from 'common/src/data/oauth/oauth-store';
import OAuthActions from 'common/src/data/oauth/oauth-actions';
import {Flummox} from 'flummox';
import {Pending, Failed} from 'common/src/fetch-result';

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions('oauth', OAuthActions);
        this.createStore('oauth', OAuthStore, this);
    }
}

describe('The oauth store', () => {
    var store,
        flux = new MockFlux();

    beforeEach(() => {
        store = flux.getStore('oauth');
    });

    afterEach(() => {
        store._empty();
    });

    it('should receive a config', () => {
        store.receiveOAuthConfig({
            id: 'kio'
        });
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