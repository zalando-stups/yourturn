/* globals expect, $, TestUtils, reset, render, React */
import Detail from 'resource/src/scope-detail/scope-detail.jsx';

/*eslint-disable react/no-deprecated */
// TODO rework usage of React.findDOMNode
const RES_ID = 'sales_order',
        SCP_ID = 'read',
        TEST_RES = {
            id: RES_ID,
            name: 'Sales Order'
        },
        TEST_SCP = {
            id: 'read',
            is_resource_owner_scope: true,
            description: '# Read scope'
        },
        TEST_APP = {
            'id': 'kio'
        };

describe('The scope detail view', () => {
    var props,
        detail;

    beforeEach(() => {
        reset();

        props = {
            resourceId: RES_ID,
            scopeId: SCP_ID,
            scopeApps: [TEST_APP],
            scope: TEST_SCP,
            resource: TEST_RES,
            canEdit: true
        };
        detail = render(Detail, props);
    });

    it('should contain rendered markdown', () => {
        let description = TestUtils.findRenderedDOMComponentWithAttributeValue(detail, 'data-block', 'description');
        expect($(React.findDOMNode(description)).find('h1').length).to.equal(1);
    });

    it('should display applications using the scope', () => {
        expect(() => TestUtils.findRenderedDOMComponentWithAttributeValue(detail, 'data-block', 'app-list'))
            .to.not.throw;
    });
});
/*eslint-enable react/no-deprecated */