/* globals expect, sinon, Promise, $, TestUtils, reset, render, React */
import {Flummox} from 'flummox';

import EssentialsStore from 'common/src/data/essentials/essentials-store';
import EssentialsTypes from 'common/src/data/essentials/essentials-types';
import * as EssentialsGetter from 'common/src/data/essentials/essentials-getter';
import * as EssentialsActions from 'common/src/data/essentials/essentials-actions';

import Form from 'resource/src/resource-form/resource-form.jsx';
import {bindGettersToState} from 'common/src/util';

const RES_ID = 'sales_order',
    TEST_RES = {
        id: 'sales_order',
        name: 'Sales Order',
        description: 'Sales Orders',
        resource_owners: ['employees']
    };

describe('The resource form view', () => {
    var props,
        actionSpy,
        form;

    describe('in edit mode', () => {
        beforeEach(() => {
            reset();

            let essentialsActions = Object.assign({}, EssentialsActions),
                essentialsState = EssentialsStore(EssentialsStore(), {
                    type: EssentialsTypes.FETCH_RESOURCE,
                    payload: TEST_RES
                });

            actionSpy = sinon.stub(essentialsActions, 'saveResource', function () {
                return Promise.resolve();
            });

            props = {
                resourceId: RES_ID,
                edit: true,
                essentialsStore: bindGettersToState(essentialsState, EssentialsGetter),
                essentialsActions
            };
            form = render(Form, props);
        });

        it('should display the available symbol', () => {
            TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'available-symbol');
        });

        it('should disable the ID input', () => {
            let input = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'id-input');
            expect($(React.findDOMNode(input)).is(':disabled')).to.be.true;
        });

        it('should call the correct action', () => {
            let f = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'form');
            TestUtils.Simulate.submit(f);
            expect(actionSpy.calledOnce).to.be.true;
        });

    });
});
