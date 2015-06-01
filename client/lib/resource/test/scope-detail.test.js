/* globals expect */
import {Flummox} from 'flummox';
import EssentialsStore from 'common/src/data/essentials/essentials-store';
import EssentialsActions from 'common/src/data/essentials/essentials-actions';
import UserStore from 'common/src/data/user/user-store';
import UserActions from 'common/src/data/user/user-actions';
import Detail from 'resource/src/scope-detail/scope-detail';

const ESSENTIALS = 'essentials',
      RES_ID = 'sales_order',
      SCP_ID = 'read';

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions(ESSENTIALS, EssentialsActions);
        this.createStore(ESSENTIALS, EssentialsStore, this);
    }
}

class GlobalFlux extends Flummox {
    constructor() {
        super();

        this.createActions('user', UserActions);
        this.createStore('user', UserStore, this);
    }
}

describe('The scope detail view', () => {
    var flux,
        globalFlux,
        TEST_SCP,
        detail;

    beforeEach(() => {
        flux = new MockFlux();
        globalFlux = new GlobalFlux();
        detail = new Detail({
            flux: flux,
            globalFlux: globalFlux,
            resourceId: RES_ID,
            scopeId: SCP_ID
        });
        TEST_SCP = {
            id: 'read',
            is_resource_owner_scope: true,
            description: '# Read scope'
        };
    });

    it('should display a placeholder when the scope is Pending', () => {
        flux.getStore(ESSENTIALS).beginFetchScope(RES_ID, SCP_ID);
        expect(detail.$el.find('.u-placeholder').length).to.equal(1);
    });

    it('should contain rendered markdown', () => {
        flux.getStore(ESSENTIALS).receiveScope([RES_ID, TEST_SCP]);
        expect(detail.$el.find('[data-block="description"] h1').length).to.equal(1);
    });
});
