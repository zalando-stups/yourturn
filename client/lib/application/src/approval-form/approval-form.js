import BaseView from 'common/src/base-view';
import Template from './approval-form.hbs';
import ApprovalCard from './approval-card/approval-card';
import 'common/asset/scss/application/approval-form.scss';

class ApprovalForm extends BaseView {
    constructor(props) {
        props.className = 'approvalForm';
        props.events = {
            'submit': 'save',
            'keyup #approval_custom_type': 'checkCustomType'
        };
        props.store = props.flux.getStore('application');
        super(props);
        this.actions = props.flux.getActions('application');
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
            approval_type = customUsed ?
                                $el.find('#approval_custom_type').val() :
                                $el.find('#approval_type option:selected').val(),
            notes = $el.find('#approval_notes').val();

        let approval = {
            approval_type: approval_type,
            notes: notes
        };

        this.actions
        .saveApproval(applicationId, versionId, approval)
        .then(() => this.actions.fetchApprovals(applicationId, versionId));
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
