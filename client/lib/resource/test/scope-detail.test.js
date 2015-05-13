/* globals expect */
import {Flummox} from 'flummox';
import ResourceStore from 'common/src/data/resource/resource-store';
import ResourceActions from 'common/src/data/resource/resource-actions';
import Detail from 'resource/src/scope-detail/scope-detail';

const RES = 'resource',
      RES_ID = 'sales_order',
      SCP_ID = 'read';

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions(RES, ResourceActions);
        this.createStore(RES, ResourceStore, this);
    }
}

describe('The scope detail view', () => {
    var flux,
        TEST_SCP,
        detail;

    beforeEach(() => {
        flux = new MockFlux();
        detail = new Detail({
            flux: flux,
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
        flux.getStore(RES).beginFetchScope(RES_ID, SCP_ID);
        expect(detail.$el.find('.u-placeholder').length).to.equal(1);
    });

    it('should contain rendered markdown', () => {
        flux.getStore(RES).receiveScope([RES_ID, TEST_SCP]);
        expect(detail.$el.find('[data-action="markdown"] h1').length).to.equal(1);
    });
});
