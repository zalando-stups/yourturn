/* global expect */

import Types from 'common/src/data/essentials/essentials-types';
import * as Getter from 'common/src/data/essentials/essentials-getter';
import Store from 'common/src/data/essentials/essentials-store';

describe('The redux scope application store', () => {
    it('should receive applications', () => {
        let state = Store(Store(), {
                type: Types.FETCH_SCOPE_APPLICATIONS,
                payload: ['customer', 'read', [{
                    id: 'kio'
                }, {
                    id: 'pierone'
                }]]
            }),
            apps = Getter.getScopeApplications(state, 'customer', 'read');
        expect(apps.length).to.equal(2);
    });
});
