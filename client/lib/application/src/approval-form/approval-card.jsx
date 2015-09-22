import React from 'react';
import Gravatar from 'react-gravatar';
import Icon from 'react-fa';
import Timestamp from 'react-time';
import {DATE_FORMAT} from 'common/src/config';
import Markdown from 'common/src/markdown.jsx';
import 'common/asset/less/application/approval-card.less';

class ApprovalCard extends React.Component {
    constructor() {
        super();
        this.state = {
            open: false
        };
    }

    toggle() {
        this.setState({
            open: !this.state.open
        });
    }

    render() {
        let {approval, userinfo} = this.props,
            {open} = this.state;
        return <div
                    onClick={this.toggle.bind(this)}
                    className={'approvalCard' + (approval.notes ? ' has-notes' : '')}>
                    <header>

                        <div className='grid'>
                            <div className='grid-col col-1-3 approvalCard-approver'>
                                <Gravatar
                                    size={75}
                                    email={userinfo.email} />
                                <div>
                                    {userinfo ? userinfo.name.split(' ')[0] : approval.user_id}
                                </div>
                            </div>
                            <div className='grid-col col-2-3 approvalCard-meta'>
                                <small className='approvalCard-time'>
                                    <Icon
                                        fixedWidth
                                        name='calendar-o'/> <Timestamp
                                            format={DATE_FORMAT}
                                            value={approval.timestamp} />
                                </small>
                                {approval.notes ?
                                    <div className='approvalCard-notes-icon'>
                                        <Icon fixedWidth name='comment' /> Click to see approval notes
                                    </div> :
                                    null}
                                <div className='approvalCard-approvalType'>
                                    <Icon fixedWidth name='check' /> {approval.approval_type}
                                </div>
                            </div>
                        </div>
                    </header>
                    {open ?
                        <div className='approvalCard-details'>
                            {approval.notes ?
                                <div className='approvalCard-notes'>
                                    <h4>Notes</h4>
                                    <Markdown src={approval.notes} />
                                </div>
                                :
                                null}
                        </div>
                        :
                        null}

                </div>;
    }
}
ApprovalCard.displayName = 'ApprovalCard';
ApprovalCard.propTypes = {
    approval: React.PropTypes.object.isRequired,
    userinfo: React.PropTypes.object.isRequired
};
export default ApprovalCard;