/* globals expect */
import {Flummox} from 'flummox';
import EssentialsStore from 'common/src/data/essentials/essentials-store';
import EssentialsActions from 'common/src/data/essentials/essentials-actions';
import UserStore from 'common/src/data/user/user-store';
import UserActions from 'common/src/data/user/user-actions';
import List from 'resource/src/resource-list/resource-list';

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

        expect(list.$el.find('[data-block="resources"]').children().length).to.equal(2);
    });

});
