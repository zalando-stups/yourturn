/* globals expect, $, TestUtils, reset, render, React */
import {Flummox} from 'flummox';
import EssentialsStore from 'common/src/data/essentials/essentials-store';
import EssentialsActions from 'common/src/data/essentials/essentials-actions';
import Form from 'resource/src/scope-form/scope-form.jsx';

const RES_ID = 'sales_order';

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions('essentials', EssentialsActions);
        this.createStore('essentials', EssentialsStore, this);
    }
}


describe('The scope form view', () => {
    var flux,
        props,
        form;

    beforeEach(() => {
        flux = new MockFlux();
    });

    describe('in create mode', () => {
        beforeEach(() => {
            reset();
            props = {
                essentialsStore: flux.getStore('essentials'),
                essentialsActions: flux.getActions('essentials')
            };
            form = render(Form, props);
        });

        it('should have application checkbox preselected', () => {
            let checkbox = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'appscope-checkbox');
            expect($(React.findDOMNode(checkbox)).is(':checked')).to.be.true;
        });

    });

    describe('in edit mode', () => {
        beforeEach(() => {
            reset();
            props = {
                resourceId: RES_ID,
                edit: true,
                essentialsStore: flux.getStore('essentials'),
                essentialsActions: flux.getActions('essentials')
            };
            form = render(Form, props);
        });

    });
});

