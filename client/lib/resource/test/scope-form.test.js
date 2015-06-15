/* globals expect */
import {Flummox} from 'flummox';
import EssentialsStore from 'common/src/data/essentials/essentials-store';
import EssentialsActions from 'common/src/data/essentials/essentials-actions';
import Form from 'resource/src/scope-form/scope-form.jsx';

const ESSENTIALS = 'essentials',
      RES_ID = 'sales_order',
      SCP_ID = 'read';

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions(ESSENTIALS, EssentialsActions);
        this.createStore(ESSENTIALS, EssentialsStore, this);
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
        beforeEach(done => {
            reset(() => {
                props = {
                    flux: flux
                };
                form = render(Form, props);
                done();
            });
        });

        it('should have application checkbox preselected', () => {
            let checkbox = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'appscope-checkbox');
            expect($(React.findDOMNode(checkbox)).is(':checked')).to.be.true;
        });

    });

    describe('in edit mode', () => {
        beforeEach(done => {
            reset(() => {
                props = {
                    flux: flux,
                    resourceId: RES_ID,
                    edit: true
                };
                form = render(Form, props);
                done();
            });
        });

    });
});

