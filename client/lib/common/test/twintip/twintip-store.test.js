/* globals expect */
import Store from 'common/src/data/twintip/twintip-store';
import Types from 'common/src/data/twintip/twintip-types';
import {Pending, Failed} from 'common/src/fetch-result';
import * as Getter from 'common/src/data/twintip/twintip-getter';

describe('The twintip redux store', () => {
    it('should receive an api', () => {
        let state = Store(Store(), {
            type: Types.FETCH_API,
            payload: {
                application_id: 'kio'
            }
        });
        expect(Getter.getApis(state).length).to.equal(1);
    });

    it('should insert a pending fetch result placeholder', () => {
        let state = Store(Store(), {
            type: Types.BEGIN_FETCH_API,
            payload: ['kio']
        });
        expect(Getter.getApi(state, 'kio') instanceof Pending).to.be.true;
    });

    it('should insert a failed fetch result placeholder', () => {
        let fetchError = new Error();
        fetchError.id = 'kio';
        let state = Store(Store(), {
            type: Types.FAIL_FETCH_API,
            payload: fetchError
        });
        expect(Getter.getApi(state, 'kio') instanceof Failed).to.be.true;
    });
});
