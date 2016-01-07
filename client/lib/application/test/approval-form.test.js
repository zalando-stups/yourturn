/* globals expect, $, TestUtils, reset, render, React */
import KioStore from 'common/src/data/kio/kio-store';
import KioTypes from 'common/src/data/kio/kio-types';
import * as KioGetter from 'common/src/data/kio/kio-getter';
import * as KioActions from 'common/src/data/kio/kio-actions';

import UserStore from 'common/src/data/user/user-store';
import UserTypes from 'common/src/data/user/user-types';
import * as UserGetter from 'common/src/data/user/user-getter';

import ApprovalForm from 'application/src/approval-form/approval-form.jsx';
import {bindGettersToState} from 'common/src/util';

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

describe('The approval form view', () => {
    var props,
        form;

    beforeEach(() => {
        reset();
        let kioActions = [{
                    type: KioTypes.FETCH_APPROVALS,
                    payload: [APP_ID, VER_ID, TEST_APPROVALS]
                }, {
                    type: KioTypes.FETCH_APPROVAL_TYPES,
                    payload: [APP_ID, TEST_APPROVAL_TYPES]
                }, {
                    type: KioTypes.FETCH_APPLICATION,
                    payload: TEST_APP
                }
            ],
            kioState = kioActions.reduce((state, action) => KioStore(state, action), KioStore()),
            userState = UserStore(UserStore(), {
                type: UserTypes.FETCH_USERACCOUNTS,
                payload: [TEST_ACCOUNT]
            });

        props = {
            applicationId: APP_ID,
            versionId: VER_ID,
            kioStore: bindGettersToState(kioState, KioGetter),
            userStore: bindGettersToState(userState, UserGetter)
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

    it('should hide the explanation when a non-default approval type is selected', () => {
        let btn = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'custom-button');
        TestUtils.Simulate.click(btn);

        expect(() => {
            TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'approvalType-explanation');
        }).to.throw;
    });

    it('should disable the submit button in foreign applications', () => {
        let btn = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'submit-button');
        expect(btn.props.disabled).to.be.true;
    });
});
