/* globals expect */
import jsdom from 'jsdom';
import $ from 'jquery';
import React from 'react';
import {Flummox} from 'flummox';
import KioStore from 'common/src/data/kio/kio-store';
import KioActions from 'common/src/data/kio/kio-actions';
import UserStore from 'common/src/data/user/user-store';
import UserActions from 'common/src/data/user/user-actions';
import ApprovalForm from 'application/src/approval-form/approval-form.jsx';

const FLUX = 'kio',
    APP_ID = 'kio',
    VER_ID = '0.1',
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

        this.createActions(FLUX, KioActions);
        this.createStore(FLUX, KioStore, this);
    }
}

class GlobalFlux extends Flummox {
    constructor() {
        super();

        this.createActions('user', UserActions);
        this.createStore('user', UserStore, this);
    }
}

describe('The approval form view', () => {
    var flux,
        globalFlux,
        reactComponent,
        reactElement,
        $form;

    function render(done) {
        let props = {
            flux: flux,
            globalFlux: globalFlux,
            applicationId: APP_ID,
            versionId: VER_ID
        };
        reactComponent = new ApprovalForm(props);
        reactElement = React.createElement(ApprovalForm, props);
        jsdom.env(React.renderToString(reactElement), (err, wndw) => {
            $form = $(wndw.document.body).find('.approvalForm');
            done();
        });
    }

    beforeEach(() => {
        flux = new MockFlux();
        globalFlux = new GlobalFlux();
    });

    it('should show approvals', () => {
        flux.getStore(FLUX).receiveApprovals([APP_ID, VER_ID, TEST_APPROVALS]);
        render(() => {
            let $list = $form.find('[data-block="approval-list"]');
            expect($list.find('.approvalCard').length).to.equal(2);
            done();
        });
    });

    it('should show all approval types in selectbox', () => {
        flux.getStore(FLUX).receiveApprovalTypes([APP_ID, ['CHAOS', 'MORE_CHAOS']]);
        render(() => {
            let $select = $form.find('[data-block="approvalType-selection"]');
            expect($select.find('option').length).to.equal(2);
            done();
        });
    });

    it('should display an explanation of default approval types', () => {
        flux.getStore(FLUX).receiveApprovalTypes([APP_ID, TEST_APPROVAL_TYPES]);
        render(() => {
            reactComponent.selectType(TEST_APPROVAL_TYPES[1]);
            console.log(React.renderToString(reactComponent));
        });
    });

    it('should hide the explanation when a non-default approval type is selected', () => {
        flux.getStore(FLUX).receiveApprovalTypes([APP_ID, TEST_APPROVAL_TYPES]);
        
    });
});