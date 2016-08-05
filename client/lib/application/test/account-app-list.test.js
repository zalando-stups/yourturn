/* globals expect, reset, render, Promise, TestUtils */
import KioStore from 'common/src/data/kio/kio-store';
import KioTypes from 'common/src/data/kio/kio-types';
import * as KioGetter from 'common/src/data/kio/kio-getter';

import AccountAppList from 'application/src/application-list/account-app-list.jsx';
import {bindGettersToState} from 'common/src/util';

// account, kioStore, showInactive, search} = this.props

const APPS = [{
    id: 'kio',
    name: 'kio',
    team_id: 'stups',
    active: false
}, {
    id: 'yourturn',
    name: 'yourturn',
    team_id: 'stups',
    active: true
}];

describe('The account app list view has no tests', () => {
    let props,
        kioState,
        list;

    beforeEach(() => {
        reset();
        kioState = KioStore(KioStore(), {
            type: KioTypes.FETCH_APPLICATIONS,
            payload: APPS
        });

        props = {
            account: 'stups',
            showInactive: false,
            kioStore: bindGettersToState(kioState, KioGetter),
            search: ''
        };
        list = render(AccountAppList, props);
    });

    it('should display active apps', () => {
        const apps = TestUtils.scryRenderedDOMComponentsWithAttributeValue(list, 'data-block', 'app');
        expect(apps.length).to.equal(1);
    });

    it('should display inactive apps', () => {
        props = {
            account: 'stups',
            showInactive: true,
            kioStore: bindGettersToState(kioState, KioGetter),
            search: ''
        };
        list = render(AccountAppList, props);
        const apps = TestUtils.scryRenderedDOMComponentsWithAttributeValue(list, 'data-block', 'app');
        expect(apps.length).to.equal(2);
    });

    it('should search for apps', () => {
        props = {
            account: 'stups',
            showInactive: true,
            kioStore: bindGettersToState(kioState, KioGetter),
            search: 'you'
        };
        list = render(AccountAppList, props);
        const apps = TestUtils.scryRenderedDOMComponentsWithAttributeValue(list, 'data-block', 'app');
        expect(apps.length).to.equal(1);
    });
});
