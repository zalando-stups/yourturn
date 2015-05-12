/* globals expect */
import {Flummox} from 'flummox';
import ApplicationStore from 'common/src/data/application/application-store';
import ApplicationActions from 'common/src/data/application/application-actions';
import ApiStore from 'common/src/data/api/api-store';
import ApiActions from 'common/src/data/api/api-actions';
import Detail from 'application/src/application-detail/application-detail';

const APP = 'application',
      API = 'api',
      ID = 'kio';

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions(APP, ApplicationActions);
        this.createStore(APP, ApplicationStore, this);

        this.createActions(API, ApiActions);
        this.createStore(API, ApiStore, this);
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