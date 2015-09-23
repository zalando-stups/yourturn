/* global expect */

import Types from 'common/src/data/essentials/essentials-types';
import ResourceStore from 'common/src/data/essentials/resource-store';
import FetchResult from 'common/src/fetch-result';

describe('The redux resource store', () => {
    it('should set a pending fetch result for a resource', () => {
        let state = ResourceStore(ResourceStore(), {
                type: Types.BEGIN_FETCH_RESOURCE,
                payload: 'customer'
            }),
            resource = state.get('customer');
        expect(resource instanceof FetchResult).to.be.true;
        expect(resource.isPending()).to.be.true;
    });

    it('should set a failed fetch result for a resource', () => {
        let err = new Error();
        err.id = 'customer';
        let state = ResourceStore(ResourceStore(), {
                type: Types.FAIL_FETCH_RESOURCE,
                payload: err
            }),
            resource = state.get('customer');
        expect(resource instanceof FetchResult).to.be.true;
        expect(resource.isFailed()).to.be.true;
    });
});