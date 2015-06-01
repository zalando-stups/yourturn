/* globals expect */
import {Flummox} from 'flummox';
import ApplicationStore from 'common/src/data/application/application-store';
import ApplicationActions from 'common/src/data/application/application-actions';
import ApprovalForm from 'application/src/approval-form/approval-form';
import UserStore from 'common/src/data/user/user-store';
import UserActions from 'common/src/data/user/user-actions';

const FLUX = 'application',
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

        this.createActions(FLUX, ApplicationActions);
        this.createStore(FLUX, ApplicationStore, this);
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
        form;

    beforeEach(() => {
        flux = new MockFlux();
        globalFlux = new GlobalFlux();
        form = new ApprovalForm({
            flux: flux,
            globalFlux: globalFlux,
            applicationId: APP_ID,
            versionId: VER_ID
        });
    });

    it('should show approvals', () => {
        flux.getStore(FLUX).receiveApprovals([APP_ID, VER_ID, TEST_APPROVALS]);
        let $list = form.$el.find('[data-block="approval-list"]');
        expect($list.find('.approvalCard').length).to.equal(2);
    });

    it('should show all approval types in selectbox', () => {
        flux.getStore(FLUX).receiveApprovalTypes([APP_ID, ['CHAOS', 'MORE_CHAOS']]);
        let $select = form.$el.find('[data-block="approvalType-selection"]');
        expect($select.find('option').length).to.equal(2);
    });

    it('should display an explanation of default approval types', () => {
        flux.getStore(FLUX).receiveApprovalTypes([APP_ID, TEST_APPROVAL_TYPES]);
        let $select = form.$el.find('[data-block="approvalType-selection"]');
        $select.find('option[value="TEST"]').prop('selected', true);
        form.explainType();
        let $explanation = form.$el.find('[data-block="approvalType-explanation"]');
        expect($explanation.attr('style')).to.equal('display: block;');
    });

    it('should hide the explanation when a non-default approval type is selected', () => {
        flux.getStore(FLUX).receiveApprovalTypes([APP_ID, TEST_APPROVAL_TYPES]);
        let $select = form.$el.find('[data-block="approvalType-selection"]');
        $select.find('option[value="UX"]').prop('selected', true);
        form.explainType();
        let $explanation = form.$el.find('[data-block="approvalType-explanation"]');
        expect($explanation.attr('style')).to.equal('display: none;');
    });
});