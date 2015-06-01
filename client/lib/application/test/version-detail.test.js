/* globals expect */
import {Flummox} from 'flummox';
import ApplicationStore from 'common/src/data/application/application-store';
import ApplicationActions from 'common/src/data/application/application-actions';
import PieroneStore from 'common/src/data/pierone/pierone-store';
import PieroneActions from 'common/src/data/pierone/pierone-actions';
import UserStore from 'common/src/data/user/user-store';
import UserActions from 'common/src/data/user/user-actions';
import Detail from 'application/src/version-detail/version-detail';

const FLUX = 'application',
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

        this.createActions(FLUX, ApplicationActions);
        this.createStore(FLUX, ApplicationStore, this);

        this.createActions('pierone', PieroneActions);
        this.createStore('pierone', PieroneStore, this);
    }
}

class GlobalFlux extends Flummox {
    constructor() {
        super();

        this.createActions('user', UserActions);
        this.createStore('user', UserStore, this);
    }
}

describe('The version detail view', () => {
    var flux,
        globalFlux,
        detail;

    beforeEach(() => {
        flux = new MockFlux();
        globalFlux = new GlobalFlux();
        flux.getStore(FLUX).receiveApplicationVersion(TEST_VERSION);
        detail = new Detail({
            flux: flux,
            globalFlux: globalFlux,
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