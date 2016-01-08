/* globals expect, $, TestUtils, reset, render, React */
import EssentialsStore from 'common/src/data/essentials/essentials-store';
import EssentialsTypes from 'common/src/data/essentials/essentials-types';
import * as EssentialsGetter from 'common/src/data/essentials/essentials-getter';
import * as EssentialsActions from 'common/src/data/essentials/essentials-actions';

import UserStore from 'common/src/data/user/user-store';
import UserTypes from 'common/src/data/user/user-types';
import * as UserGetter from 'common/src/data/user/user-getter';

import List from 'resource/src/resource-list/resource-list.jsx';
import {bindGettersToState} from 'common/src/util';

const TEST_RESOURCES = [{
    id: 'sales_order',
    name: 'Sales Order'
}, {
    id: 'customer',
    name: 'Customer'
}];

describe('The resource list view', () => {
    var props,
        list;

    beforeEach(() => {
        reset();

        let essentialsState = EssentialsStore(EssentialsStore(), {
            type: EssentialsTypes.FETCH_RESOURCES,
            payload: TEST_RESOURCES
        });

        props = {
            essentialsStore: bindGettersToState(essentialsState, EssentialsGetter),
            userStore: bindGettersToState(UserStore(), UserGetter)
        };
        list = render(List, props);
    });

    it('should not display a list without resources', () => {
        props.essentialsStore = bindGettersToState(EssentialsStore(), EssentialsGetter);
        list = render(List, props);
        expect(() => {
            TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'resources');
        }).to.throw;
    });

    it('should display a list of resources', () => {
        let resources = TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'resources');
        expect($(React.findDOMNode(resources)).children().length).to.equal(2);
    });
});
