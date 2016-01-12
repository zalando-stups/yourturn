/* global expect, $, TestUtils, reset, render, React */
import Detail from 'application/src/application-detail/application-detail.jsx';
import {bindGettersToState} from 'common/src/util';

import KioStore from 'common/src/data/kio/kio-store';
import KioTypes from 'common/src/data/kio/kio-types';
import * as KioGetter from 'common/src/data/kio/kio-getter';

import UserStore from 'common/src/data/user/user-store';
import UserTypes from 'common/src/data/user/user-types';
import * as UserGetter from 'common/src/data/user/user-getter';

import TwintipStore from 'common/src/data/twintip/twintip-store';
import TwintipTypes from 'common/src/data/twintip/twintip-types';
import * as TwintipGetter from 'common/src/data/twintip/twintip-getter';
import * as TwintipActions from 'common/src/data/twintip/twintip-actions';

const APP = 'kio',
      API = 'twintip',
      ID = 'kio',
      USER = 'user';

describe('The application detail view', () => {
    var TEST_APP,
        props,
        detail;

    beforeEach(() => {
        reset();

        TEST_APP = {
            documentation_url: 'https://github.com/zalando-stups/kio',
            scm_url: 'https://github.com/zalando-stups/kio.git',
            service_url: 'https://kio.example.org/',
            description: '# Kio',
            subtitle: 'STUPS application registry',
            name: 'Kio',
            active: true,
            team_id: 'stups',
            id: ID,
            publicly_accessible: true
        };

        let twintipState = TwintipStore(TwintipStore(), {
                type: TwintipTypes.BEGIN_FETCH_API,
                payload: [ID]
            }),
            kioState = KioStore(KioStore(), {
                type: KioTypes.FETCH_APPLICATION,
                payload: TEST_APP
            }),
            userState = UserStore();

        props = {
            applicationId: ID,
            kioStore: bindGettersToState(kioState, KioGetter),
            twintipStore: bindGettersToState(twintipState, TwintipGetter),
            userStore: bindGettersToState(userState, UserGetter)
        };
        detail = render(Detail, props);
    });

    it('should display a placeholder when the application is Pending', () => {
        let kioState = KioStore(props.kioState, {
            type: KioTypes.BEGIN_FETCH_APPLICATION,
            payload: [ID]
        });
        props.kioStore = bindGettersToState(kioState, KioGetter);

        detail = render(Detail, props);
        let placeholders = TestUtils.scryRenderedDOMComponentsWithClass(detail, 'u-placeholder');
        expect(placeholders.length).to.equal(1);
    });

    it('should not a display a placeholder when the api is Pending', () => {
        detail = render(Detail, props);
        let placeholders = TestUtils.scryRenderedDOMComponentsWithClass(detail, 'u-placeholder');
        expect(placeholders.length).to.equal(0);
    });

    it('should display an inactive badge when the application is inactive', () => {
        TEST_APP.active = false;
        let kioState = KioStore(props.kioState, {
            type: KioTypes.FETCH_APPLICATION,
            payload: TEST_APP
        });
        props.kioStore = bindGettersToState(kioState, KioGetter);

        detail = render(Detail, props);
        let inactiveBadges = TestUtils.scryRenderedDOMComponentsWithAttributeValue(detail, 'data-block', 'inactive-badge');
        expect(inactiveBadges.length).to.equal(1);
    });

    it('should not display a badge when the application is active', () => {
        detail = render(Detail, props);
        let inactiveBadges = TestUtils.scryRenderedDOMComponentsWithAttributeValue(detail, 'data-block', 'inactive-badge');
        expect(inactiveBadges.length).to.equal(0);
    });

    it('should contain rendered markdown', () => {
        detail = render(Detail, props);
        expect($(React.findDOMNode(detail)).find('[data-block="description"] h1').length).to.equal(1);
    });

    it('should display buttons to alter criticality', () => {
        detail = render(Detail, props);
        TestUtils.findRenderedDOMComponentWithAttributeValue(detail, 'data-block', 'increase-criticality-button');
        TestUtils.findRenderedDOMComponentWithAttributeValue(detail, 'data-block', 'decrease-criticality-button');
    });

    it('should display a "is public" badge', () => {
        detail = render(Detail, props);
        TestUtils.findRenderedDOMComponentWithAttributeValue(detail, 'data-block', 'public-badge');
    });
});
