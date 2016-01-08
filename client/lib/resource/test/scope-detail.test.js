/* globals expect, $, TestUtils, reset, render, React */
import EssentialsStore from 'common/src/data/essentials/essentials-store';
import EssentialsTypes from 'common/src/data/essentials/essentials-types';
import * as EssentialsGetter from 'common/src/data/essentials/essentials-getter';
import * as EssentialsActions from 'common/src/data/essentials/essentials-actions';

import UserStore from 'common/src/data/user/user-store';
import UserTypes from 'common/src/data/user/user-types';
import * as UserGetter from 'common/src/data/user/user-getter';

import Detail from 'resource/src/scope-detail/scope-detail.jsx';
import {bindGettersToState} from 'common/src/util';

const RES_ID = 'sales_order',
        SCP_ID = 'read',
        TEST_SCP = {
            id: 'read',
            is_resource_owner_scope: true,
            description: '# Read scope'
        },
        TEST_APP = {
            'id': 'kio'
        };

describe('The scope detail view', () => {
    var props,
        detail;

    beforeEach(() => {
        reset();

        let setup = [{
                type: EssentialsTypes.FETCH_SCOPE,
                payload: [RES_ID, TEST_SCP]
            }, {
                type: EssentialsTypes.FETCH_SCOPE_APPLICATIONS,
                payload: [RES_ID, SCP_ID, [TEST_APP]]
            }],
            essentialsState = setup.reduce((state, action) => EssentialsStore(state, action), EssentialsStore());

        props = {
            resourceId: RES_ID,
            scopeId: SCP_ID,
            essentialsStore: bindGettersToState(essentialsState, EssentialsGetter),
            userStore: bindGettersToState(UserStore(), UserGetter)
        };
        detail = render(Detail, props);
    });

    it('should contain rendered markdown', () => {
        let description = TestUtils.findRenderedDOMComponentWithAttributeValue(detail, 'data-block', 'description');
        expect($(React.findDOMNode(description)).find('h1').length).to.equal(1);
    });

    it('should display applications using the scope', () => {
        expect(() => TestUtils.findRenderedDOMComponentWithAttributeValue(detail, 'data-block', 'app-list'))
            .to.not.throw;
    });
});
