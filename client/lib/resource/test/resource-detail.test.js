/* globals expect */
import {Flummox} from 'flummox';
import EssentialsStore from 'common/src/data/essentials/essentials-store';
import EssentialsActions from 'common/src/data/essentials/essentials-actions';
import UserStore from 'common/src/data/user/user-store';
import UserActions from 'common/src/data/user/user-actions';
import Detail from 'resource/src/resource-detail/resource-detail';

const ESSENTIALS = 'essentials',
      ID = 'sales_order';

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

describe('The resource detail view', () => {
    var flux,
        globalFlux,
        TEST_RES,
        detail;

    beforeEach(() => {
        flux = new MockFlux();
        globalFlux = new GlobalFlux();
        detail = new Detail({
            flux: flux,
            resourceId: ID,
            globalFlux: globalFlux
        });
        TEST_RES = {
            id: 'sales_order',
            name: 'Sales Order',
            description: '# Sales Orders',
            resource_owners: ['employees']
        };

    });

    it('should display a placeholder when the resource is Pending', () => {
        flux.getStore(ESSENTIALS).beginFetchResource(ID);
        expect(detail.$el.find('.u-placeholder').length).to.equal(1);
    });

    it('should contain rendered markdown', () => {
        flux.getStore(ESSENTIALS).receiveResource(TEST_RES);
        expect(detail.$el.find('[data-block="description"] h1').length).to.equal(1);
    });

});
