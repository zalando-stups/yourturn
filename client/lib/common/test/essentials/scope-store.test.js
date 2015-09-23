/* global expect */

import Types from 'common/src/data/essentials/essentials-types';
import * as Getter from 'common/src/data/essentials/essentials-getter';
import ScopeStore from 'common/src/data/essentials/scope-store';

describe('The redux scope store', () => {
    it('should receive scopes from multiple resources', () => {
        let state = ScopeStore();
        state = ScopeStore(state, {
            type: Types.RECEIVE_SCOPE,
            payload: ['customer', {
                id: 'read_all'
            }]
        });
        state = ScopeStore(state, {
            type: Types.RECEIVE_SCOPE,
            payload: ['sales_order', {
                id: 'read'
            }]
        });

        // they should be there
        expect(Getter.getScopes(state, 'customer').length).to.equal(1);
        expect(Getter.getScopes(state, 'sales_order').length).to.equal(1);
    });
});
