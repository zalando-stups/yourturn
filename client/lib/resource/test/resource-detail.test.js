/* globals expect, $, TestUtils, reset, render, React */
import Detail from 'resource/src/resource-detail/resource-detail.jsx';

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
        props = {
            resourceId: ID,
            resource: TEST_RES,
            scopes: [],
            canEdit: true
        };
        detail = render(Detail, props);
    });

    it('should contain rendered markdown', () => {
        let description = TestUtils.findRenderedDOMComponentWithAttributeValue(detail, 'data-block', 'description');
        expect($(React.findDOMNode(description)).find('h1').length).to.equal(1);
    });

});
