/* globals expect, sinon, Promise, $, TestUtils, reset, render, React */
import {Flummox} from 'flummox';
import EssentialsStore from 'common/src/data/essentials/essentials-store';
import EssentialsActions from 'common/src/data/essentials/essentials-actions';
import Form from 'resource/src/resource-form/resource-form.jsx';

const RES_ID = 'sales_order',
    TEST_RES = {
        id: 'sales_order',
        name: 'Sales Order',
        description: 'Sales Orders',
        resource_owners: ['employees']
    };

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions('essentials', EssentialsActions);
        this.createStore('essentials', EssentialsStore, this);
    }
}

describe('The resource form view', () => {
    var flux,
        props,
        actionSpy,
        form;

    beforeEach(() => {
        flux = new MockFlux();
        actionSpy = sinon.stub(flux.getActions('essentials'), 'saveResource', function () {
            return Promise.resolve();
        });
    });


    describe('in create mode', () => {
        beforeEach(() => {
            form = new Form({
                essentialsStore: flux.getStore('essentials'),
                essentialsActions: flux.getActions('essentials')
            });
        });
    });

    describe('in edit mode', () => {
        beforeEach(() => {
            reset();
            flux.getStore('essentials').receiveResource(TEST_RES);
            props = {
                resourceId: RES_ID,
                edit: true,
                essentialsStore: flux.getStore('essentials'),
                essentialsActions: flux.getActions('essentials')
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
