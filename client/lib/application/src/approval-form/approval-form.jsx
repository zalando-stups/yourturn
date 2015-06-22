import React from 'react';
import Icon from 'react-fa';
import {Link} from 'react-router';
import ApprovalCard from './approval-card.jsx';
import 'common/asset/less/application/approval-form.less';

const EXPLANATIONS = {
    SPECIFICATION: 'Tickets are properly specified and have useful content.',
    CODE_CHANGE: 'The approver asserts that there are no unwanted code changes, i.e. did a code review.',
    TEST: 'The tests are okay, however they look like for this application.',
    DEPLOY: 'The approver asserts that the code status in the deployment artifact for this version is ready to deploy.'
};

class ApprovalForm extends React.Component {
    constructor(props) {
        super();
        this.stores = {
            kio: props.flux.getStore('kio'),
            user: props.globalFlux.getStore('user')
        };
        this.actions = props.flux.getActions('kio');
        this.state = {
            useCustomType: false,
            customType: '',
            selectedType: this.stores.kio.getApprovalTypes(props.applicationId)[0],
            notes: ''
        };

        this._forceUpdate = this.forceUpdate.bind(this);
        this.stores.user.on('change', this._forceUpdate);
    }

    componentWillUnmount() {
        this.stores.user.off('change', this._forceUpdate);
    }

    selectType(evt) {
        this.setState({
            selectedType: evt.target.value
        });
    }

    updateNotes(evt) {
        this.setState({
            notes: evt.target.value
        });
    }

    save(evt) {
        evt.preventDefault();
        let {applicationId, versionId} = this.props,
            {kio} = this.stores,
            {notes, useCustomType, customType, selectedType} = this.state,
            application = kio.getApplication(applicationId),
            approval;

        if (!useCustomType) {
            approval = {
                approval_type: selectedType,
                notes: notes
            };
        } else {
            // custom type was entered
            if (!customType.length) {
                // invariant!
                // custom type checked, but empty
                return this
                        .props
                        .globalFlux
                        .getActions('notification')
                        .addNotification(
                            'Conflict: You checked the "Custom" box, but did not enter an approval type.',
                            'error');
            } else {
                approval = {
                    approval_type: customType,
                    notes: notes
                };
            }
        }

        this
        .actions
        .saveApproval(applicationId, versionId, approval)
        .then(() => {
            // re-fetch approvals
            this.actions.fetchApprovals(applicationId, versionId);
            if (useCustomType) {
                this.actions.fetchApprovalTypes(applicationId);
            }
            // reset state
            this.setState({
                notes: '',
                useCustomType: false,
                customType: ''
            });
        })
        .catch(err => {
            this
            .props
            .globalFlux
            .getActions('notification')
            .addNotification(
                `Could not approve version ${versionId} of ${application.name}. ${err.message}`,
                'error');
        });
    }

    toggleCustomType() {
        this.setState({
            useCustomType: !this.state.useCustomType
        });
    }

    updateCustomType(evt) {
        this.setState({
            customType: evt.target.value
        });
    }

    render() {
        let {applicationId, versionId} = this.props,
            {kio, user} = this.stores,
            application = kio.getApplication(applicationId),
            approvalTypes = kio.getApprovalTypes(applicationId),
            approvals = kio.getApprovals(applicationId, versionId),
            isOwnApplication = user.getUserTeams().map(t => t.id).indexOf(application.team_id) >= 0;
        const LINK_PARAMS = {
            applicationId: applicationId,
            versionId: versionId
        };
        return <div className='approvalForm'>
                    <h2>
                        <Link
                            to='application-appDetail'
                            params={LINK_PARAMS}>{application.name || applicationId}</Link> <Link
                            to='application-verDetail'
                            className='approvalForm-versionId'
                            params={LINK_PARAMS}>{versionId}</Link> Approvals
                    </h2>
                    <div className='btn-group'>
                        <Link
                            to='application-verDetail'
                            params={LINK_PARAMS}
                            className='btn btn-default'>
                            <Icon name='chevron-left' /> {application.name} {versionId}
                        </Link>
                    </div>
                    <div className='grid with-gutter'>
                        <div className='grid-col col-1-2'>
                            <h4>Existing approvals</h4>
                            <div
                                data-block='approval-list'
                                className='approvalForm-approvalList'>
                                {approvals.map(
                                    (a, i) => <ApprovalCard
                                                key={i}
                                                approval={a} />)}
                            </div>
                        </div>
                        <div className='grid-col col-1-2'>
                            <h4>Add approval</h4>
                            <form
                                onSubmit={this.save.bind(this)}
                                className='form'>
                                <div className='form-group'>
                                    <label htmlFor='approval_type'>Approval Type</label>
                                    <small>What specifically do you approve?</small>
                                    <select
                                        id='approval_type'
                                        data-block='approvalType-selection'
                                        name='yourturn_approval_type'
                                        value={this.state.selectedType}
                                        onChange={this.selectType.bind(this)}
                                        type='text'>
                                        {approvalTypes.map(
                                            at => <option value={at}>{at}</option>)}
                                    </select>
                                    {EXPLANATIONS[this.state.selectedType] ?
                                        <div>
                                            <small
                                                data-block='approvalType-explanation'>
                                                {EXPLANATIONS[this.state.selectedType]}
                                            </small>
                                        </div>
                                        :
                                        null}
                                    <small>or</small>
                                    <label>
                                        <input
                                            id='approval_custom'
                                            checked={this.state.useCustomType}
                                            onChange={this.toggleCustomType.bind(this)}
                                            type='checkbox' /> Custom:
                                    </label>
                                    <input
                                        id='approval_custom_type'
                                        name='yourturn_approval_custom_type'
                                        placeholder='CUSTOM_TYPE'
                                        pattern='[a-zA-Z_][a-zA-Z_]*[a-zA-Z]'
                                        title='Only characters'
                                        value={this.state.customType}
                                        onChange={this.updateCustomType.bind(this)}
                                        type='text' />
                                </div>
                                <div className='form-group'>
                                    <label htmlFor='approval_notes'>Notes</label>
                                    <small>You can use <a href='http://www.unexpected-vortices.com/sw/rippledoc/quick-markdown-example.html'>Markdown</a>.</small>
                                    <textarea
                                        id='approval_notes'
                                        name='yourturn_approval_notes'
                                        placeholder={`I swear by the life of my firstborn that ${application.name} ${versionId} is properly tested.`}
                                        cols='30'
                                        onChange={this.updateNotes.bind(this)}
                                        value={this.state.notes}
                                        rows='10'></textarea>
                                </div>
                                <div className='btn-group'>
                                    <button
                                        type='submit'
                                        className='btn btn-primary'
                                        data-block='submit-button'
                                        disabled={!isOwnApplication}>
                                        <Icon name='save' /> Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>;
    }
}
ApprovalForm.displayName = 'ApprovalForm';
ApprovalForm.propTypes = {
    globalFlux: React.PropTypes.object.isRequired,
    applicationId: React.PropTypes.string.isRequired,
    versionId: React.PropTypes.string.isRequired
};
ApprovalForm.contextTypes = {
    router: React.PropTypes.func.isRequired
};
export default ApprovalForm;