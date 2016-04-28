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
        form,
        essentialsActions,
        kioActions;

    beforeEach(() => {
        reset();

        essentialsActions = Object.assign({}, EssentialsActions);
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
            existingResourceIds: [],
            essentialsActions,
            kioActions
        };
        form = render(Form, props);
    });

    describe('in create mode', () => {
        it('should check already existing resources', done => {
            props.existingResourceIds = ['kio.app'];
            form = render(Form, props);
            const input = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'id-input');
            input.value = 'kio.app';
            TestUtils.Simulate.change(input);
            setTimeout(() => {
                expect($(input).hasClass('invalid')).to.be.true;
                done();
            }, 200);
        });

        it('should check team membership of app', done => {
            props.kioActions = {
                fetchApplication: id => Promise.resolve({ id: 'kio', team_id: 'stups' })
            };
            props.userAccounts = ['stups'];
            props.existingResourceIds = ['foo', 'bar'];
            form = render(Form, props);
            const input = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'id-input');
            input.value = 'kio.application';
            TestUtils.Simulate.change(input);
            setTimeout(() => {
                expect($(input).hasClass('valid')).to.be.true;
                done();
            }, 200);
        });
        it('should allow if user is whitelisted and no app exists', done => {
            props.kioActions = {
                fetchApplication: id => Promise.reject()
            };
            props.isUserWhitelisted = true;
            form = render(Form, props);
            const input = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'id-input');
            input.value = 'kio.application';
            TestUtils.Simulate.change(input);
            setTimeout(() => {
                expect($(input).hasClass('valid')).to.be.true;
                done();
            }, 200);
        });

        it('should not allow if user is not whitelisted and no app exists', done => {
            props.kioActions = {
                fetchApplication: id => Promise.reject()
            };
            form = render(Form, props);
            const input = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'id-input');
            input.value = 'kio.application';
            TestUtils.Simulate.change(input);
            setTimeout(() => {
                expect($(input).hasClass('invalid')).to.be.true;
                done();
            }, 200);
        });
    });

    describe('in edit mode', () => {
        it('should display the available symbol', () => {
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
