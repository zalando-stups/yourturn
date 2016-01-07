/* globals expect, $, TestUtils, reset, render, React */
import KioStore from 'common/src/data/kio/kio-store';
import KioTypes from 'common/src/data/kio/kio-types';
import * as KioGetter from 'common/src/data/kio/kio-getter';
import * as KioActions from 'common/src/data/kio/kio-actions';

import PieroneStore from 'common/src/data/pierone/pierone-store';
import PieroneTypes from 'common/src/data/pierone/pierone-types';
import * as PieroneGetter from 'common/src/data/pierone/pierone-getter';
import * as PieroneActions from 'common/src/data/pierone/pierone-actions';

import UserStore from 'common/src/data/user/user-store';
import UserTypes from 'common/src/data/user/user-types';
import * as UserGetter from 'common/src/data/user/user-getter';

import Detail from 'application/src/version-detail/version-detail.jsx';
import {bindGettersToState} from 'common/src/util';

const TEAM = 'stups',
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

describe('The version detail view', () => {
    var props,
        pieroneState,
        detail;

    beforeEach(() => {
        reset();
        let kioState = KioStore(KioStore(), {
                type: KioTypes.FETCH_APPLICATION_VERSION,
                payload: TEST_VERSION
            }),
            userState = UserStore();

        pieroneState = PieroneStore(PieroneStore(), {
            type: PieroneTypes.FETCH_TAGS,
            payload: [TEAM, APP, [{
                name: VER
            }]]
        });

        props = {
            applicationId: APP,
            versionId: VER,
            kioStore: bindGettersToState(kioState, KioGetter),
            userStore: bindGettersToState(userState, UserGetter),
            pieroneStore: bindGettersToState(pieroneState, PieroneGetter)
        };
        detail = render(Detail, props);
    });

    it('should show rendered markdown', () => {
        let notes = TestUtils.findRenderedDOMComponentWithAttributeValue(detail, 'data-block', 'version-notes');
        expect($(React.findDOMNode(notes)).find('h1').length).to.equal(1);
    });

    it('should display a warning about modified scm-source', () => {
        let newPieroneState = PieroneStore(pieroneState, {
            type: PieroneTypes.FETCH_SCM_SOURCE,
            payload: [TEAM, APP, VER, TEST_SOURCE]
        });
        props.pieroneStore = bindGettersToState(newPieroneState, PieroneGetter);

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
        let newPieroneState = PieroneStore(pieroneState, {
            type: PieroneTypes.FAIL_FETCH_SCM_SOURCE,
            payload: error
        });
        props.pieroneStore = bindGettersToState(newPieroneState, PieroneGetter);

        detail = render(Detail, props);
        TestUtils.findRenderedDOMComponentWithAttributeValue(detail, 'data-block', 'missing-scmsource-warning');
    });
});