/* globals expect, $, TestUtils, reset, render, React */
import {Flummox} from 'flummox';
import EssentialsStore from 'common/src/data/essentials/essentials-store';
import EssentialsActions from 'common/src/data/essentials/essentials-actions';
import UserStore from 'common/src/data/user/user-store';
import UserActions from 'common/src/data/user/user-actions';
import Detail from 'resource/src/resource-detail/resource-detail.jsx';

const ESSENTIALS = 'essentials',
      ID = 'sales_order',
      TEST_RES = {
            id: 'sales_order',
            name: 'Sales Order',
            description: '# Sales Orders',
            resource_owners: ['employees']
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

describe('The resource detail view', () => {
    var flux,
        props,
        detail;

    beforeEach(() => {
        reset();
        flux = new MockFlux();
        flux.getStore(ESSENTIALS).receiveResource(TEST_RES);
        props = {
            flux: flux,
            resourceId: ID
        };
        detail = render(Detail, props);
    });

    it('should contain rendered markdown', () => {
        let description = TestUtils.findRenderedDOMComponentWithAttributeValue(detail, 'data-block', 'description');
        expect($(React.findDOMNode(description)).find('h1').length).to.equal(1);
    });

});
