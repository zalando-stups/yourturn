/* globals expect */
import {Flummox} from 'flummox';
import ResourceStore from 'common/src/data/resource/resource-store';
import ResourceActions from 'common/src/data/resource/resource-actions';
import UserStore from 'common/src/data/user/user-store';
import UserActions from 'common/src/data/user/user-actions';
import List from 'resource/src/resource-list/resource-list';

const FLUX_ID = 'resource';

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions(FLUX_ID, ResourceActions);
        this.createStore(FLUX_ID, ResourceStore, this);
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
        list;

    beforeEach(() => {
        flux = new MockFlux();
        globalFlux = new GlobalFlux();
        list = new List({
            flux: flux,
            globalFlux: globalFlux
        });
    });

    it('should not display a list without resources', () => {
        expect(list.$el.find('ul').length).to.equal(0);
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

        expect(list.$el.find('ul > li').length).to.equal(2);
    });

});
