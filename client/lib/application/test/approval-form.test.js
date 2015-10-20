/* globals expect, $, TestUtils, reset, render, React */
import {Flummox} from 'flummox';
import KioStore from 'common/src/data/kio/kio-store';
import KioActions from 'common/src/data/kio/kio-actions';
import UserStore from 'common/src/data/user/user-store';
import UserActions from 'common/src/data/user/user-actions';
import ApprovalForm from 'application/src/approval-form/approval-form.jsx';

const APP_ID = 'kio',
    VER_ID = '0.1',
    TEST_ACCOUNT = {
        id: '234',
        name: 'greendale'
    },
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
        approved_at: '2015-04-25T16:25:00'
    }, {
        application_id: APP_ID,
        version_id: VER_ID,
        approval_type: 'TEST',
        user_id: 'tobi',
        approved_at: '2015-04-25T16:40:00'
    }];

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions('kio', KioActions);
        this.createStore('kio', KioStore, this);

        this.createActions('user', UserActions);
        this.createStore('user', UserStore, this);
    }
}

describe('The approval form view', () => {
    var flux,
        props,
        form;

    beforeEach(() => {
        reset();
        flux = new MockFlux();
        props = {
            applicationId: APP_ID,
            versionId: VER_ID,
            kioStore: flux.getStore('kio'),
            userStore: flux.getStore('user')
        };
        form = render(ApprovalForm, props);
    });

    it('should show approvals', () => {
        flux.getStore('kio').receiveApprovals([APP_ID, VER_ID, TEST_APPROVALS]);
        form = render(ApprovalForm, props);
        let approvals = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'approval-list');
        expect($(React.findDOMNode(approvals)).children().length).to.equal(2);
    });

    it('should display an explanation of default approval types', () => {
        flux.getStore('kio').receiveApprovalTypes([APP_ID, TEST_APPROVAL_TYPES]);
        form = render(ApprovalForm, props);
        TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'approvalType-explanation');
    });

    it('should hide the explanation when a non-default approval type is selected', () => {
        flux.getStore('kio').receiveApprovalTypes([APP_ID, TEST_APPROVAL_TYPES]);
        form = render(ApprovalForm, props);

        let btn = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'custom-button');
        TestUtils.Simulate.click(btn);

        expect(() => {
            TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'approvalType-explanation');
        }).to.throw;
    });

    it('should disable the submit button in foreign applications', () => {
        flux.getStore('user').receiveAccounts([TEST_ACCOUNT]);
        flux.getStore('kio').receiveApplication(TEST_APP);

        form = render(ApprovalForm, props);

        let btn = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'submit-button');
        expect(btn.props.disabled).to.be.true;
    });
});
