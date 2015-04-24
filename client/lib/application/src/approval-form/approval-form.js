import BaseView from 'common/src/base-view';
import Template from './approval-form.hbs';
import Flux from 'application/src/flux';
import ApprovalCard from './approval-card/approval-card';
import 'common/asset/scss/application/approval-form.scss';

class ApprovalForm extends BaseView {
    constructor(props) {
        this.store = Flux.getStore('application');
        this.className = 'approvalForm';
        this.events = {
            'submit': 'save',
            'keyup #approval_custom_type': 'checkCustomType'
        };
        super(props);
    }

    checkCustomType() {
        let isUsed = this.$el.find('#approval_custom_type').val().length > 0;
        this.$el.find('#approval_custom').prop('checked', isUsed);
    }

    save(evt) {
        evt.preventDefault();

        let {$el} = this,
            {applicationId, versionId} = this.props,
            customUsed = $el.find('#approval_custom_type').val().length > 0,
            user_id = $el.find('#approval_user').val(),
            approval_type = customUsed ?
                                $el.find('#approval_custom_type').val() :
                                $el.find('#approval_type option:selected').val(),
            notes = $el.find('#approval_notes').val();

        let approval = {
            application_id: applicationId,
            version_id: versionId,
            user_id: user_id,
            approval_type: approval_type,
            notes: notes
        };

        Flux.getActions('application').saveApproval(approval);
    }

    update() {
        let {applicationId, versionId} = this.props;
        this.data = {
            applicationId: applicationId,
            versionId: versionId,
            approvals: this.store.getApprovals(applicationId, versionId)
        };
    }

    render() {
        this.$el.html(Template(this.data));
        this.$el.find('#approval_user').focus();

        // render approval list
        let $list = this.$el.find('.approvalForm-approvalList');
        $list.children().remove();
        this.data.approvals.forEach(a => {
            let card = new ApprovalCard({ approval: a});
            $list.append(card.render().$el);
        });
        return this;
    }
}

export default ApprovalForm;
