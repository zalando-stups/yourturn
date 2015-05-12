/* globals expect */
import {Flummox} from 'flummox';
import ApplicationStore from 'common/src/data/application/application-store';
import ApplicationActions from 'common/src/data/application/application-actions';
import Detail from 'application/src/version-detail/version-detail';

const FLUX = 'application',
    VER = '0.1',
    APP = 'kio',
    TEST_VERSION = {
        id: VER,
        application_id: APP,
        artifact: `docker://stups/${APP}:${VER}`,
        notes: '# Test'
    };

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions(FLUX, ApplicationActions);
        this.createStore(FLUX, ApplicationStore, this);
    }
}

describe('The version detail view', () => {
    var flux,
        detail;

    beforeEach(() => {
        flux = new MockFlux();
        detail = new Detail({
            flux: flux,
            applicationId: APP,
            versionId: VER
        });
    });

    it('should show a placeholder if version is Pending', () => {
        flux.getStore(FLUX).beginFetchApplicationVersion(APP, VER);
        expect(detail.$el.find('.u-placeholder').length).to.equal(1);
    });

    it('should not show a placeholder when version is not Pending', () => {
        flux.getStore(FLUX).receiveApplicationVersion(TEST_VERSION);
        expect(detail.$el.find('.u-placeholder').length).to.equal(0);
    });

    it('should show rendered markdown', () => {
        flux.getStore(FLUX).receiveApplicationVersion(TEST_VERSION);
        expect(detail.$el.find('[data-block="version-notes"] h1').length).to.equal(1);
    });
});