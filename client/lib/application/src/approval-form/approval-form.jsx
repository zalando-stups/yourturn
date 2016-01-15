import React from 'react';
import Icon from 'react-fa';
import {Link} from 'react-router';
import * as Routes from 'application/src/routes';
import {Typeahead} from 'react-typeahead';
import Markdown from 'common/src/markdown.jsx';
import Collapsible from 'common/src/collapsible.jsx';
import ApprovalCard from './approval-card.jsx';
import 'common/asset/less/application/approval-form.less';

const EXPLANATIONS = {
    SPECIFICATION: <div>
                        <span>By approving this you declare that the specifications</span>
                        <ul>
                            <li>are approved by you</li>
                            <li>are stored digitally and the links are active</li>
                        </ul>
                    </div>,
    CODE_CHANGE: <div>
                    <span>By approving this you declare that</span>
                    <ul>
                        <li>all code changes including new automated tests are approved by you</li>
                        <li>all code changes are done by a member of your delivery team</li>
                    </ul>
                </div>,
    TEST: <div>
            <span>By approving this you declare that</span>
            <ul>
                <li>all code changes have been reviewed and tested</li>
                <li>the extent and method of the tests are sufficient to ensure the quality and security of this version and therefore are approved by you</li>
            </ul>
        </div>,
    DEPLOY: <div>
                <span>By approving this you declare that</span>
                <ul>
                    <li>all other approvals are done</li>
                    <li>deployment is approved and done by you</li>
                </ul>
            </div>
};

class ApprovalForm extends React.Component {
    constructor(props) {
        super();
        this.state = {
            useCustomType: false,
            customType: '',
            selectedType: 'SPECIFICATION',
            notes: '',
            loading: false
        };
    }

    selectType(type) {
        this.setState({
            selectedType: type,
            useCustomType: type === 'CUSTOM'
        });
    }

    updateNotes(evt) {
        this.setState({
            notes: evt.target.value
        });
    }

    save(evt) {
        evt.preventDefault();
        let {applicationId, versionId, kioStore} = this.props,
            {notes, useCustomType, customType, selectedType} = this.state,
            application = kioStore.getApplication(applicationId),
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
                return this.props.notificationActions
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

        this.setState({
            loading: true
        });

        this.props.kioActions
        .saveApproval(applicationId, versionId, approval)
        .then(() => {
            // re-fetch approvals
            this.props.kioActions.fetchApprovals(applicationId, versionId);
            if (useCustomType) {
                this.props.kioActions.fetchApprovalTypes(applicationId);
            }
            // reset state
            this.setState({
                notes: '',
                customType: '',
                loading: false
            });
        })
        .catch(err => {
            this.setState({
                loading: false
            });

            this.props.notificationActions
            .addNotification(
                `Could not approve version ${versionId} of ${application.name}. ${err.message}`,
                'error');
        });
    }

    updateCustomType(evt) {
        this.setState({
            customType: typeof evt === 'string' ? evt : evt.target.value
        });
    }

    render() {
        let {applicationId, versionId, kioStore, userStore} = this.props,
            application = kioStore.getApplication(applicationId),
            approvalTypes = kioStore.getApprovalTypes(applicationId),
            approvals = kioStore.getApprovals(applicationId, versionId),
            isOwnApplication = userStore.getUserCloudAccounts().map(a => a.name).indexOf(application.team_id) >= 0;
        const LINK_PARAMS = {
            applicationId: applicationId,
            versionId: versionId
        };
        return <div className='approvalForm'>
                    <h2>
                        <Link
                            to={Routes.appDetail(LINK_PARAMS)}>{application.name || applicationId}</Link> <Link
                            to={Routes.verDetail(LINK_PARAMS)}
                            className='approvalForm-versionId'>{versionId}</Link> Approvals
                    </h2>
                    <div className='btn-group'>
                        <Link
                            to={Routes.verDetail(LINK_PARAMS)}
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
                                                userinfo={userStore.getUserInfo(a.user_id)}
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
                                    <div className='btn-group'>
                                        <div
                                            data-selected={this.state.selectedType === 'SPECIFICATION'}
                                            data-block='spec-button'
                                            onClick={this.selectType.bind(this, 'SPECIFICATION')}
                                            className='btn btn-default btn-no-unselect'>
                                            <Icon name='file-text-o' /> Specification
                                        </div>
                                        <div
                                            data-selected={this.state.selectedType === 'CODE_CHANGE'}
                                            onClick={this.selectType.bind(this, 'CODE_CHANGE')}
                                            className='btn btn-default btn-no-unselect'>
                                            <Icon name='code' /> Code Change
                                        </div>
                                        <div
                                            data-selected={this.state.selectedType === 'TEST'}
                                            onClick={this.selectType.bind(this, 'TEST')}
                                            className='btn btn-default btn-no-unselect'>
                                            <Icon name='check-circle-o' /> Test
                                        </div>
                                        <div
                                            data-selected={this.state.selectedType === 'DEPLOY'}
                                            onClick={this.selectType.bind(this, 'DEPLOY')}
                                            className='btn btn-default btn-no-unselect'>
                                            <Icon name='cloud-upload' /> Deploy
                                        </div>
                                        <div
                                            data-selected={this.state.selectedType === 'CUSTOM'}
                                            data-block='custom-button'
                                            onClick={this.selectType.bind(this, 'CUSTOM')}
                                            className='btn btn-default'>
                                            <Icon name='asterisk' /> Custom
                                        </div>
                                    </div>
                                    {EXPLANATIONS[this.state.selectedType] ?
                                        <div className='u-info'>
                                            <small data-block='approvalType-explanation'>
                                                {EXPLANATIONS[this.state.selectedType]}
                                            </small>
                                        </div>
                                        :
                                        this.state.useCustomType ?
                                        <label>
                                            Please enter your custom approval type:
                                        </label>
                                        :
                                        null}
                                    {this.state.useCustomType ?
                                        <Typeahead
                                            onKeyUp={this.updateCustomType.bind(this)}
                                            onOptionSelected={this.updateCustomType.bind(this)}
                                            placeholder='CUSTOM_TYPE'
                                            inputProps={{autoFocus: true}}
                                            options={approvalTypes}
                                            maxVisible={3} />
                                        :
                                        null
                                    }
                                </div>
                                <Collapsible
                                    header='Notes'
                                    initialCollapsed={true}>
                                    <div className='form-group'>
                                        <label htmlFor='approval_notes'>Notes</label>
                                        <small>You can use <a href='http://www.unexpected-vortices.com/sw/rippledoc/quick-markdown-example.html'>Markdown</a>.</small>
                                        <Markdown
                                            editable={true}
                                            placeholder={`I swear by the life of my firstborn that ${application.name} ${versionId} is properly tested.`}
                                            src={this.state.notes}
                                            onChange={this.updateNotes.bind(this)} />
                                    </div>
                                </Collapsible>
                                <div className='btn-group'>
                                    <button
                                        type='submit'
                                        className='btn btn-primary'
                                        data-block='submit-button'
                                        disabled={!isOwnApplication}>
                                        <Icon
                                            fixedWidth
                                            spin={this.state.loading}
                                            name={this.state.loading ? 'circle-o-notch' : 'save'} /> Approve
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
    applicationId: React.PropTypes.string.isRequired,
    versionId: React.PropTypes.string.isRequired,
    notificationActions: React.PropTypes.object.isRequired,
    kioActions: React.PropTypes.object.isRequired,
    kioStore: React.PropTypes.object.isRequired,
    userStore: React.PropTypes.object.isRequired
};
export default ApprovalForm;
