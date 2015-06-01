/* globals expect */
import {Flummox} from 'flummox';
import KioStore from 'common/src/data/kio/kio-store';
import KioActions from 'common/src/data/kio/kio-actions';
import TwintipStore from 'common/src/data/twintip/twintip-store';
import TwintipActions from 'common/src/data/twintip/twintip-actions';
import Detail from 'application/src/application-detail/application-detail';

const APP = 'kio',
      API = 'twintip',
      ID = 'kio';

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions(APP, KioActions);
        this.createStore(APP, KioStore, this);

        this.createActions(API, TwintipActions);
        this.createStore(API, TwintipStore, this);
    }
}

describe('The application detail view', () => {
    var flux,
        TEST_APP,
        detail;

    beforeEach(() => {
        flux = new MockFlux();
        detail = new Detail({
            flux: flux,
            applicationId: ID
        });
        TEST_APP = {
            documentation_url: 'https://github.com/zalando-stups/kio',
            scm_url: 'https://github.com/zalando-stups/kio.git',
            service_url: 'https://kio.example.org/',
            description: '# Kio',
            subtitle: 'STUPS application registry',
            name: 'Kio',
            active: true,
            team_id: 'stups',
            id: 'kio'
        };
    });

    it('should display a placeholder when the application is Pending', () => {
        flux.getStore(APP).beginFetchApplication(ID);
        expect(detail.$el.find('.u-placeholder').length).to.equal(1);
    });

    it('should not a display a placeholder when the api is Pending', () => {
        flux.getStore(APP).receiveApplication(TEST_APP);
        flux.getStore(API).beginFetchApi(ID);
        expect(detail.$el.find('.u-placeholder').length).to.equal(0);
    });

    it('should display an inactive badge when the application is inactive', () => {
        TEST_APP.active = false;
        flux.getStore(APP).receiveApplication(TEST_APP);
        expect(detail.$el.find('[data-block="inactive-badge"]').length).to.equal(1);
    });

    it('should not display a badge when the application is active', () => {
        flux.getStore(APP).receiveApplication(TEST_APP);
        expect(detail.$el.find('[data-block="inactive-badge"]').length).to.equal(0);
    });

    it('should contain rendered markdown', () => {
        flux.getStore(APP).receiveApplication(TEST_APP);
        expect(detail.$el.find('[data-block="description"] h1').length).to.equal(1);
    });
});