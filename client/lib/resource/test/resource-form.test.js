/* globals expect, sinon, Promise, $, TestUtils, reset, render, React */
import * as EssentialsActions from 'common/src/data/essentials/essentials-actions';
import * as KioActions from 'common/src/data/kio/kio-actions';

import Form from 'resource/src/resource-form/resource-form.jsx';

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

            const essentialsActions = Object.assign({}, EssentialsActions),
                  kioActions = Object.assign({}, KioActions);

            actionSpy = sinon.stub(essentialsActions, 'saveResource', function () {
                return Promise.resolve();
            });

            props = {
                resourceId: RES_ID,
                edit: true,
                resource: TEST_RES,
                userAccounts: [],
                isUserWhitelisted: false,
                essentialsActions,
                kioActions
            };
            form = render(Form, props);
        });

        it('should display the available symbol initally', () => {
            const symbol = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'symbol');
            expect($(React.findDOMNode(symbol)).hasClass('fa-check')).to.be.true;
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
