/* globals expect */
import {Flummox} from 'flummox';
import KioStore from 'common/src/data/kio/kio-store';
import KioActions from 'common/src/data/kio/kio-actions';
import PieroneStore from 'common/src/data/pierone/pierone-store';
import PieroneActions from 'common/src/data/pierone/pierone-actions';
import Detail from 'application/src/version-detail/version-detail';

const FLUX = 'kio',
    TEAM = 'stups',
    VER = '0.1',
    APP = 'kio',
    TEST_VERSION = {
        id: VER,
        application_id: APP,
        artifact: `docker://docker.io/${TEAM}/${APP}:${VER}`,
        notes: '# Test'
    },
    TEST_SOURCE = {
        author: 'npiccolotto',
        status: 'M index.html'
    };

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions(FLUX, KioActions);
        this.createStore(FLUX, KioStore, this);

        this.createActions('pierone', PieroneActions);
        this.createStore('pierone', PieroneStore, this);
    }
}

describe('The version detail view', () => {
    var flux,
        detail;

    beforeEach(() => {
        flux = new MockFlux();
        flux.getStore(FLUX).receiveApplicationVersion(TEST_VERSION);
        detail = new Detail({
            flux: flux,
            applicationId: APP,
            versionId: VER
        });
        detail.update();
        detail.render();
    });

    it('should not show a placeholder when version is not Pending', () => {
        expect(detail.$el.find('.u-placeholder').length).to.equal(0);
    });

    it('should show rendered markdown', () => {
        expect(detail.$el.find('[data-block="version-notes"] h1').length).to.equal(1);
    });

    it('should display a warning about modified scm-source', () => {
        flux.getStore('pierone').receiveScmSource([TEAM, APP, VER, TEST_SOURCE]);
        detail.update();
        detail.render();
        expect(detail.$el.find('[data-block="locally-modified-warning"]').length).to.equal(1);
    });

    it('should display a warning about missing scm-source', () => {
        let error = new Error();
        error.team = TEAM;
        error.artifact = APP;
        error.tag = VER;
        error.status = 404;
        flux.getStore('pierone').failFetchScmSource(error);
        flux.getStore('pierone').receiveTags([TEAM, APP, [{
            name: VER
        }]]);
        detail.update();
        detail.render();
        expect(detail.$el.find('[data-block="missing-scmsource-warning"]').length).to.equal(1);
    });
});