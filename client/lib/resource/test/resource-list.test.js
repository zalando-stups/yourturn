/* globals expect, $, TestUtils, reset, render, React */
import List from 'resource/src/resource-list/resource-list.jsx';
import {bindGettersToState} from 'common/src/util';

const TEST_RESOURCES = [{
    id: 'sales_order',
    name: 'Sales Order'
}, {
    id: 'customer',
    name: 'Customer'
}];

describe('The resource list view', () => {
    var props,
        list;

    beforeEach(() => {
        reset();
        props = {
            resources: TEST_RESOURCES
        };
        list = render(List, props);
    });

    it('should not display a list without resources', () => {
        props.resources = [];
        list = render(List, props);
        expect(() => {
            TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'resources');
        }).to.throw;
    });

    it('should display a list of resources', () => {
        let resources = TestUtils.findRenderedDOMComponentWithAttributeValue(list, 'data-block', 'resources');
        expect($(React.findDOMNode(resources)).children().length).to.equal(2);
    });
});
