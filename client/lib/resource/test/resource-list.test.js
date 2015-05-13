/* globals expect */
import {Flummox} from 'flummox';
import ResourceStore from 'common/src/data/resource/resource-store';
import ResourceActions from 'common/src/data/resource/resource-actions';
import List from 'resource/src/resource-list/resource-list';

const FLUX_ID = 'resource';

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions(FLUX_ID, ResourceActions);
        this.createStore(FLUX_ID, ResourceStore, this);
    }
}

describe('The resource list view', () => {
    var flux,
        list;

    beforeEach(() => {
        flux = new MockFlux();
        list = new List({
            flux: flux
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
