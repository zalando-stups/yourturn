/* global expect */

import Types from 'common/src/data/essentials/essentials-types';
import * as Getter from 'common/src/data/essentials/essentials-getter';
import ScopeAppStore from 'common/src/data/essentials/application-store';

describe('The redux scope application store', () => {
    it('should receive applications', () => {
        let state = ScopeAppStore(ScopeAppStore(), {
            type: Types.RECEIVE_SCOPE_APPLICATIONS,
            payload: ['customer', 'read', [{
                id: 'kio'
            }, {
                id: 'pierone'
            }]]
        });

        let apps = Getter.getScopeApplications(state, 'customer', 'read');
        expect(apps.length).to.equal(2);
    });
});