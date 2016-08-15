/* globals expect, $, TestUtils, reset, render, React */
import Form from 'resource/src/scope-form/scope-form.jsx';

/*eslint-disable react/no-deprecated */
// TODO rework usage of React.findDOMNode
const RES_ID = 'sales_order',
      TEST_RES = {
        id: RES_ID,
        name: 'Sales Order'
      };

describe('The scope form view', () => {
    var props,
        form;

    describe('in create mode', () => {
        beforeEach(() => {
            reset();

            props = {
                existingScopeIds: [],
                edit: false,
                resourceId: RES_ID,
                scopeId: 'test',
                resource: TEST_RES
            };
            form = render(Form, props);
        });

        it('should have application checkbox preselected', () => {
            let checkbox = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'appscope-checkbox');
            expect($(React.findDOMNode(checkbox)).is(':checked')).to.be.true;
        });
    });
});
/*eslint-enable react/no-deprecated */