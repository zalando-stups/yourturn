import React from 'react';
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
        let {approval} = this.props,
            {open} = this.state;
        return <div
                    onClick={this.toggle.bind(this)}
                    className='approvalCard'>
                    <header>
                        <div className='grid'>
                            <span className='approvalCard-approvalType grid-col'>
                                <i className='fa fa-check'></i> {approval.approval_type}
                            </span>
                            <span className='grid-col'>from <strong>{approval.user_id}</strong></span>
                            {approval.notes ?
                                <span><i className='fa fa-comment'></i></span>
                                :
                                null}
                        </div>
                    </header>
                    {open ?
                        <div className='approvalCard-details'>
                            <div className='approvalCard-time'>
                                on <Timestamp
                                        format={DATE_FORMAT}
                                        value={approval.timestamp} />
                            </div>
                            {approval.notes ?
                                <div className='approvalCard-notes'>
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

export default ApprovalCard;