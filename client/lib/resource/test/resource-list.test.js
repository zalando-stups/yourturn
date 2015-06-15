/* globals expect, $, TestUtils, reset, render, React */
import {Flummox} from 'flummox';
import EssentialsStore from 'common/src/data/essentials/essentials-store';
import EssentialsActions from 'common/src/data/essentials/essentials-actions';
import UserStore from 'common/src/data/user/user-store';
import UserActions from 'common/src/data/user/user-actions';
import List from 'resource/src/resource-list/resource-list.jsx';

const FLUX_ID = 'essentials';

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions(FLUX_ID, EssentialsActions);
        this.createStore(FLUX_ID, EssentialsStore, this);
    }
}

class GlobalFlux extends Flummox {
    constructor() {
        super();

        this.createActions('user', UserActions);
        this.createStore('user', UserStore, this);
    }
}

describe('The resource list view', () => {
    var flux,
        globalFlux,
        props,
        list;

    beforeEach(done => {
        reset(() => {
            flux = new MockFlux();
            globalFlux = new GlobalFlux();
            props = {
                flux: flux,
                globalFlux: globalFlux
            };
            list = render(List, props);
            done();
        });
    });

    it('should not display a list without resources', () => {
        expect(() => {
            TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'resources');
        }).to.throw;
    });

    it('should display a list of resources', () => {
        flux
        .getStore(FLUX_ID)
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
