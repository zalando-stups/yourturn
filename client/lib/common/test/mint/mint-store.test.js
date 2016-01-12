/* globals expect */
import MintStore from 'common/src/data/mint/mint-store';
import Types from 'common/src/data/mint/mint-types';
import * as Getter from 'common/src/data/mint/mint-getter';
import {Pending, Failed} from 'common/src/fetch-result';

describe('The redux mint store', () => {
    it('should receive a config', () => {
        let state = MintStore(MintStore(), {
                type: Types.FETCH_OAUTH_CONFIG,
                payload: ['kio', { id: 'kio' }]
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
                payload: ['kio']
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
