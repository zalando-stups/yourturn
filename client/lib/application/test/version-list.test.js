/* globals expect, $, TestUtils, reset, render, React */
import KioStore from 'common/src/data/kio/kio-store';
import KioTypes from 'common/src/data/kio/kio-types';
import * as KioGetter from 'common/src/data/kio/kio-getter';
import * as KioActions from 'common/src/data/kio/kio-actions';

import UserStore from 'common/src/data/user/user-store';
import * as UserGetter from 'common/src/data/user/user-getter';

import List from 'application/src/version-list/version-list.jsx';
import {bindGettersToState} from 'common/src/util';

const APP_ID = 'kio',
    APP_VERSIONS = [{
        id: 'few-squirrels',
        application_id: APP_ID
    }, {
        id: 'many-squirrels',
        application_id: APP_ID
    }];

describe('The version list view', () => {
    var props,
        list;

    beforeEach(() => {
        reset();

        let kioState = KioStore(KioStore(), {
            type: KioTypes.FETCH_APPLICATION_VERSIONS,
            payload: APP_VERSIONS
        });

        props = {
            applicationId: APP_ID,
            userStore: bindGettersToState(UserStore(), UserGetter),
            kioStore: bindGettersToState(kioState, KioGetter)
        };
        list = render(List, props);
    });

    it('should not display a list without versions', () => {
        props.kioStore = bindGettersToState(KioStore(), KioGetter);
        list = render(List, props);

        expect(() => {
            TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'versions');
        }).to.throw();
    });

    it('should display a list of application versions', () => {
        TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'versions');
    });

    it('should display a filtered list of application versions', () => {
        let input = TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'search-input');
        TestUtils.Simulate.change(input, {
            target: {
                value: 'few'
            }
        });
        let versions = TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'versions');
        expect($(React.findDOMNode(versions)).children().length).to.equal(1);
    });
});