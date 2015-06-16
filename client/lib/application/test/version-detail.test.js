/* globals expect, $, TestUtils, reset, render, React */
import {Flummox} from 'flummox';
import KioStore from 'common/src/data/kio/kio-store';
import KioActions from 'common/src/data/kio/kio-actions';
import PieroneStore from 'common/src/data/pierone/pierone-store';
import PieroneActions from 'common/src/data/pierone/pierone-actions';
import UserStore from 'common/src/data/user/user-store';
import UserActions from 'common/src/data/user/user-actions';
import Detail from 'application/src/version-detail/version-detail.jsx';

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
        props,
        detail;

    beforeEach(() => {
        reset();
        flux = new MockFlux();
        globalFlux = new GlobalFlux();
        flux.getStore(FLUX).receiveApplicationVersion(TEST_VERSION);
        props = {
            flux: flux,
            globalFlux: globalFlux,
            applicationId: APP,
            versionId: VER
        };
        detail = render(Detail, props);
    });

    it('should show rendered markdown', () => {
        let notes = TestUtils.findRenderedDOMComponentWithAttributeValue(detail, 'data-block', 'version-notes');
        expect($(React.findDOMNode(notes)).find('h1').length).to.equal(1);
    });

    it('should display a warning about modified scm-source', () => {
        flux.getStore('pierone').receiveScmSource([TEAM, APP, VER, TEST_SOURCE]);
        detail = render(Detail, props);
        // will throw if not there
        TestUtils.findRenderedDOMComponentWithAttributeValue(detail, 'data-block', 'locally-modified-warning');
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
        detail = render(Detail, props);
        TestUtils.findRenderedDOMComponentWithAttributeValue(detail, 'data-block', 'missing-scmsource-warning');
    });
});