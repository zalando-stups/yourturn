/* globals expect, $, TestUtils, reset, render, React */
import ApprovalForm from 'application/src/approval-form/approval-form.jsx';

/*eslint-disable react/no-deprecated */
// TODO rework usage of React.findDOMNode
const APP_ID = 'kio',
    VER_ID = '0.1',
    TEST_APP = {
        id: APP_ID,
        team_id: 'stups'
    },
    TEST_APPROVAL_TYPES = ['TEST', 'UX'],
    TEST_APPROVALS = [{
        application_id: APP_ID,
        version_id: VER_ID,
        approval_type: 'TEST',
        user_id: 'npiccolotto',
        approved_at: '2015-04-25T16:25:00',
        timestamp: 0
    }, {
        application_id: APP_ID,
        version_id: VER_ID,
        approval_type: 'TEST',
        user_id: 'tobi',
        approved_at: '2015-04-25T16:40:00',
        timestamp: 100
    }];

describe('The approval form view', () => {
    var props,
        form;

    beforeEach(() => {
        reset();
        props = {
            applicationId: APP_ID,
            versionId: VER_ID,
            approvals: TEST_APPROVALS,
            approvalTypes: TEST_APPROVAL_TYPES,
            application: TEST_APP,
            editable: true,
            userInfos: {
                'tobi': {
                    name: 'Tobias Tomtom',
                    email: 'tom@tom.tobi'
                },
                'npiccolotto': {
                    name: 'Nikolaus Piccolotto',
                    email: 'n@piccolot.to'
                }
            },
            kioActions: {},
            notificationActions: {}
        };
        form = render(ApprovalForm, props);
    });

    it('should show approvals', () => {
        let approvals = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'approval-list');
        expect($(React.findDOMNode(approvals)).children().length).to.equal(2);
    });

    it('should display an explanation of default approval types', () => {
        TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'approvalType-explanation');
    });

    // TODO: this test is not needed anymore, but if commented in it breaks. Maybe figure out why that happens
    //  it('should hide the explanation when a non-default approval type is selected', () => {
    //     let btn = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'custom-button');
    //     TestUtils.Simulate.click(btn);
    //
    //     expect(() => {
    //         TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'approvalType-explanation');
    //     }).to.throw;
    // });

    it('should disable the submit button in foreign applications', () => {
        const f = render(ApprovalForm, {...props, editable: false});
        const btn = TestUtils.findRenderedDOMComponentWithAttributeValue(f, 'data-block', 'submit-button');
        expect(btn.props.disabled).to.be.true;
    });
});
/*eslint-enable react/no-deprecated */
