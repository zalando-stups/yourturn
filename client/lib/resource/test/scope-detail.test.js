/* globals expect, $, TestUtils, reset, render, React */
import {Flummox} from 'flummox';
import EssentialsStore from 'common/src/data/essentials/essentials-store';
import EssentialsActions from 'common/src/data/essentials/essentials-actions';
import UserStore from 'common/src/data/user/user-store';
import UserActions from 'common/src/data/user/user-actions';
import Detail from 'resource/src/scope-detail/scope-detail.jsx';

const ESSENTIALS = 'essentials',
      RES_ID = 'sales_order',
      SCP_ID = 'read',
      TEST_SCP = {
            id: 'read',
            is_resource_owner_scope: true,
            description: '# Read scope'
        };

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions(ESSENTIALS, EssentialsActions);
        this.createStore(ESSENTIALS, EssentialsStore, this);

        this.createActions('user', UserActions);
        this.createStore('user', UserStore, this);
    }
}

describe('The scope detail view', () => {
    var flux,
        props,
        detail;

    beforeEach(() => {
        reset();
        flux = new MockFlux();
        props = {
            flux: flux,
            resourceId: RES_ID,
            scopeId: SCP_ID
        };
        flux.getStore(ESSENTIALS).receiveScope([RES_ID, TEST_SCP]);
        detail = render(Detail, props);
    });

    it('should contain rendered markdown', () => {
        let description = TestUtils.findRenderedDOMComponentWithAttributeValue(detail, 'data-block', 'description');
        expect($(React.findDOMNode(description)).find('h1').length).to.equal(1);
    });
});
