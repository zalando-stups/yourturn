/* globals expect */
import {Flummox} from 'flummox';
import KioStore from 'common/src/data/kio/kio-store';
import KioActions from 'common/src/data/kio/kio-actions';
import List from 'application/src/version-list/version-list';

const FLUX_ID = 'kio',
      APP_ID = 'kio';

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions(FLUX_ID, KioActions);
        this.createStore(FLUX_ID, KioStore, this);
    }
}

describe('The version list view', () => {
    var flux,
        list;

    beforeEach(() => {
        flux = new MockFlux();
        list = new List({
            flux: flux,
            applicationId: APP_ID
        });
    });

    it('should not display a list without versions', () => {
        expect(list.$el.find('[data-block="versions"]').children().length).to.equal(0);
    });

    it('should display a list of application versions', () => {
        flux
        .getStore(FLUX_ID)
        .receiveApplicationVersions([{
            id: '0.1',
            application_id: APP_ID
        }, {
            id: 'many-squirrels',
            application_id: APP_ID
        }]);
        expect(list.$el.find('[data-block="versions"]').children().length).to.equal(2);
    });

    it('should display a filtered list of application versions', () => {
        flux
        .getStore(FLUX_ID)
        .receiveApplicationVersions([{
            id: 'few-squirrels',
            application_id: APP_ID
        }, {
            id: 'many-squirrels',
            application_id: APP_ID
        }]);
        list.$el.find('[data-block="search-input"]').val('few');
        list.$el.find('form').submit();
        expect(list.$el.find('[data-block="versions"]').children().length).to.equal(1);
    });
});