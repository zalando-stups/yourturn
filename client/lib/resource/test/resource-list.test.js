/* globals expect, $, TestUtils, reset, render, React */
import {Flummox} from 'flummox';
import EssentialsStore from 'common/src/data/essentials/essentials-store';
import EssentialsActions from 'common/src/data/essentials/essentials-actions';
import UserStore from 'common/src/data/user/user-store';
import UserActions from 'common/src/data/user/user-actions';
import List from 'resource/src/resource-list/resource-list.jsx';

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions('essentials', EssentialsActions);
        this.createStore('essentials', EssentialsStore, this);

        this.createActions('user', UserActions);
        this.createStore('user', UserStore, this);
    }
}

describe('The resource list view', () => {
    var flux,
        props,
        list;

    beforeEach(() => {
        reset();
        flux = new MockFlux();
        props = {
            essentialsStore: flux.getStore('essentials'),
            userStore: flux.getStore('user')
        };
        list = render(List, props);
    });

    it('should not display a list without resources', () => {
        expect(() => {
            TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'resources');
        }).to.throw;
    });

    it('should display a list of resources', () => {
        flux
        .getStore('essentials')
        .receiveResources([{
            id: 'sales_order',
            name: 'Sales Order'
        }, {
            id: 'customer',
            name: 'Customer'
        }]);
        list = render(List, props);
        let resources = TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'resources');
        expect($(React.findDOMNode(resources)).children().length).to.equal(2);
    });

});
