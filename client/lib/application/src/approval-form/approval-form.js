import BaseView from 'common/src/base-view';
import Template from './approval-form.hbs';
import ApprovalCard from './approval-card/approval-card';
import 'common/asset/scss/application/approval-form.scss';

const EXPLANATIONS = {
    SPECIFICATION: 'Tickets are properly specified and have useful content.',
    CODE_CHANGE: 'The approver asserts that there are no unwanted code changes, i.e. did a code review.',
    TEST: 'The tests are okay, however they look like for this application.',
    DEPLOY: 'The approver asserts that the code status in the deployment artifact for this version is ready to deploy.'
};

class ApprovalForm extends BaseView {
    constructor(props) {
        props.className = 'approvalForm';
        props.events = {
            'submit': 'save',
            'change #approval_type': 'explainType',
            'keyup #approval_custom_type': 'checkCustomType'
        };
        props.stores = {
            kio: props.flux.getStore('kio'),
            user: props.globalFlux.getStore('user')
        };
        super(props);
        this.actions = props.flux.getActions('kio');
    }

    explainType() {
        let {$el} = this,
            $explanation = $el.find('[data-action="explain-approval"]'),
            approvalType = $el.find('#approval_type option:selected').val();

        if (!EXPLANATIONS[approvalType]) {
            return $explanation.css('display', 'none');
        }
        $explanation.css('display', 'block');
        $explanation.text(EXPLANATIONS[approvalType]);
    }

    checkCustomType() {
        let isUsed = this.$el.find('#approval_custom_type').val().length > 0;
        this.$el.find('#approval_custom').prop('checked', isUsed);
    }

    save(evt) {
        evt.preventDefault();

        let {$el} = this,
            {applicationId, versionId} = this.props,
            $customTypeInput = $el.find('#approval_custom_type'),
            customUsed = $customTypeInput.val().length > 0 &&
                         $el.find('#approval_custom').is(':checked'),
            approvalType = customUsed ?
                                $customTypeInput.val() :
                                $el.find('#approval_type option:selected').val(),
            notes = $el.find('#approval_notes').val(),

            approval = {
                approval_type: approvalType,
                notes: notes
            };

        this
        .actions
        .saveApproval(applicationId, versionId, approval)
        .then(() => this.actions.fetchApprovals(applicationId, versionId))
        .catch(err => {
            this
            .props
            .globalFlux
            .getActions('notification')
            .addNotification(
                `Could not approve version ${versionId} of ${this.data.application.name}. ${err.message}`,
                'error');
        });
    }

    update() {
        let {applicationId, versionId} = this.props,
            application = this.stores.kio.getApplication(applicationId);
        this.data = {
            applicationId: applicationId,
            application: application,
            approvals: this.stores.kio.getApprovals(applicationId, versionId),
            approvalTypes: this.stores.kio.getApprovalTypes(applicationId),
            isOwnApplication: this.stores.user
                                    .getUserTeams()
                                    .map(team => team.id)
                                    .some(id => id === application.team_id),
            versionId: versionId
        };
    }

    render() {
        this.$el.html(Template(this.data));
        this.$el.find('#approval_user').focus();

        // render approval list
        let $list = this.$el.find('.approvalForm-approvalList');
        $list.children().remove();

        this
        .data
        .approvals
        .forEach(a => {
            let card = new ApprovalCard({approval: a});
            $list.append(card.render().$el);
        });

        this.explainType();
        return this;
    }
}

export default ApprovalForm;
