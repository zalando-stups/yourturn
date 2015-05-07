import $ from 'jquery';
import {Flummox} from 'flummox';
import ApplicationStore from 'common/src/data/application/application-store';
import ApplicationActions from 'common/src/data/application/application-actions';
import List from 'application/src/application-list/application-list';

const FLUX_ID = 'application';

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions(FLUX_ID, ApplicationActions);
        this.createStore(FLUX_ID, ApplicationStore, this);
    }
}

describe('The application list view', () => {
    var flux,
        list;

    beforeEach(() => {
        flux = new MockFlux();
        list = new List({
            flux: flux
        });
    });

    it('should not display a list without applications', () => {
        expect(list.$el.find('ul').length).to.equal(0);
    });

    it('should display a list of applications', () => {
        flux
        .getStore(FLUX_ID)
        .receiveApplications([{
            id: 'kio',
            name: 'Kio'
        }, {
            id: 'yourturn',
            name: 'Yourturn'
        }]);

        expect(list.$el.find('ul > li').length).to.equal(2);
    });
});