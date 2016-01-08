/* globals expect, $, TestUtils, reset, render, React */
import {Flummox} from 'flummox';
import EssentialsStore from 'common/src/data/essentials/essentials-store';
import EssentialsTypes from 'common/src/data/essentials/essentials-types';
import * as EssentialsGetter from 'common/src/data/essentials/essentials-getter';

import UserStore from 'common/src/data/user/user-store';
import UserTypes from 'common/src/data/user/user-types';
import * as UserGetter from 'common/src/data/user/user-getter';

import Detail from 'resource/src/resource-detail/resource-detail.jsx';
import {bindGettersToState} from 'common/src/util';

const ID = 'sales_order',
      TEST_RES = {
            id: 'sales_order',
            name: 'Sales Order',
            description: '# Sales Orders',
            resource_owners: ['employees']
        };

describe('The resource detail view', () => {
    var props,
        detail;

    beforeEach(() => {
        reset();
        let essentialsState = EssentialsStore(EssentialsStore(), {
            type: EssentialsTypes.FETCH_RESOURCE,
            payload: TEST_RES
        }),
        userState = UserStore();

        props = {
            resourceId: ID,
            essentialsStore: bindGettersToState(essentialsState, EssentialsGetter),
            userStore: bindGettersToState(userState, UserGetter)
        };
        detail = render(Detail, props);
    });

    it('should contain rendered markdown', () => {
        let description = TestUtils.findRenderedDOMComponentWithAttributeValue(detail, 'data-block', 'description');
        expect($(React.findDOMNode(description)).find('h1').length).to.equal(1);
    });

});
