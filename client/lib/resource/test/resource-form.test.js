/* globals expect, sinon, Promise */
import {Flummox} from 'flummox';
import EssentialsStore from 'common/src/data/essentials/essentials-store';
import EssentialsActions from 'common/src/data/essentials/essentials-actions';
import Form from 'resource/src/resource-form/resource-form.jsx';

const ESSENTIALS = 'essentials',
    RES_ID = 'sales_order',
    TEST_RES = {
        id: 'sales_order',
        name: 'Sales Order',
        description: 'Sales Orders',
        resource_owners: ['employees']
    };

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions(ESSENTIALS, EssentialsActions);
        this.createStore(ESSENTIALS, EssentialsStore, this);
    }
}

describe('The resource form view', () => {
    var flux,
        props,
        actionSpy,
        form;

    beforeEach(() => {
        flux = new MockFlux();
        actionSpy = sinon.stub(flux.getActions(ESSENTIALS), 'saveResource', function () {
            return Promise.resolve();
        });
    });


    describe('in create mode', () => {
        beforeEach(() => {
            form = new Form({
                flux: flux
            });
        });
    });

    describe('in edit mode', () => {
        beforeEach(done => {
            reset(() => {
                flux.getStore(ESSENTIALS).receiveResource(TEST_RES);
                props = {
                    flux: flux,
                    resourceId: RES_ID,
                    edit: true
                };
                form = render(Form, props);
                done();
            });
        });

        it('should display the available symbol', () => {
            TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'available-symbol');
        });

        it('should disable the ID input', () => {
            let input = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'id-input');
            expect($(React.findDOMNode(input)).is(':disabled')).to.be.true;
        });

        it('should call the correct action', () => {
            form.save();
            expect(actionSpy.calledOnce).to.be.true;
        });

    });
});
