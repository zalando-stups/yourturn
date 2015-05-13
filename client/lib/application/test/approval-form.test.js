/* globals expect */
import {Flummox} from 'flummox';
import ApplicationStore from 'common/src/data/application/application-store';
import ApplicationActions from 'common/src/data/application/application-actions';
import ApprovalForm from 'application/src/approval-form/approval-form';

const FLUX = 'application',
    APP_ID = 'kio',
    VER_ID = '0.1',
    TEST_APPROVALS = [{
        application_id: APP_ID,
        version_id: VER_ID,
        approval_type: 'TESTED',
        user_id: 'npiccolotto',
        approved_at: '2015-04-25T16:25:00'
    }, {
        application_id: APP_ID,
        version_id: VER_ID,
        approval_type: 'TESTED',
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

describe('The approval form view', () => {
    var flux,
        form;

    beforeEach(() => {
        flux = new MockFlux();
        form = new ApprovalForm({
            flux: flux,
            applicationId: APP_ID,
            versionId: VER_ID
        });
    });

    it('should show approvals', () => {
        flux.getStore(FLUX).receiveApprovals(TEST_APPROVALS);
        let $list = form.$el.find('[data-block="approval-list"]');
        expect($list.find('.approvalCard').length).to.equal(2);
    });

    it('should show all approval types in selectbox', () => {
        flux.getStore(FLUX).receiveApprovalTypes([APP_ID, ['CHAOS', 'MORE_CHAOS']]);
        let $select = form.$el.find('[data-block="approvalType-selection"]');
        expect($select.find('option').length).to.equal(2);
    });

});