/* globals expect */
import {Flummox} from 'flummox';
import ResourceStore from 'common/src/data/resource/resource-store';
import ResourceActions from 'common/src/data/resource/resource-actions';
import UserStore from 'common/src/data/user/user-store';
import UserActions from 'common/src/data/user/user-actions';
import Detail from 'resource/src/resource-detail/resource-detail';

const RES = 'resource',
      ID = 'sales_order';

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions(RES, ResourceActions);
        this.createStore(RES, ResourceStore, this);
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
        flux.getStore(RES).beginFetchResource(ID);
        expect(detail.$el.find('.u-placeholder').length).to.equal(1);
    });

    it('should contain rendered markdown', () => {
        flux.getStore(RES).receiveResource(TEST_RES);
        expect(detail.$el.find('[data-block="description"] h1').length).to.equal(1);
    });

});
