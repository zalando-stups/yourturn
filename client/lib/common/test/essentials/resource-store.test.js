/* global expect */

import Types from 'common/src/data/essentials/essentials-types';
import Store from 'common/src/data/essentials/essentials-store';
import * as Getter from 'common/src/data/essentials/essentials-getter';
import FetchResult from 'common/src/fetch-result';

describe('The redux resource store', () => {
    it('should set a pending fetch result for a resource', () => {
        let state = Store(Store(), {
                type: Types.BEGIN_FETCH_RESOURCE,
                payload: ['customer']
            }),
            resource = Getter.getResource(state, 'customer');
        expect(resource instanceof FetchResult).to.be.true;
        expect(resource.isPending()).to.be.true;
    });

    it('should set a failed fetch result for a resource', () => {
        let err = new Error();
        err.id = 'customer';
        let state = Store(Store(), {
                type: Types.FAIL_FETCH_RESOURCE,
                payload: err
            }),
            resource = Getter.getResource(state, 'customer');
        expect(resource instanceof FetchResult).to.be.true;
        expect(resource.isFailed()).to.be.true;
    });
});