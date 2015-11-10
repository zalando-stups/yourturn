import React from 'react';
import {Link} from 'react-router';
import Icon from 'react-fa';
import Timestamp from 'react-time';
import {DATE_FORMAT} from 'common/src/config';
import 'common/asset/less/violation/violation-card.less';

class ViolationCard extends React.Component {
    constructor() {
        super();
        this.state = {
            message: ''
        };
    }

    updateMessage(evt) {
        this.setState({
            message: evt.target.value
        });
    }

    resolve(evt) {
        if (evt) {
            evt.preventDefault();
        }
        let {violation} = this.props,
            {message} = this.state;

        if (this.props.onResolve) {
            this.props.onResolve(violation, message);
        }
    }

    render() {
        let {violation} = this.props,
            {violation_type} = violation;
        return <div
                    data-block='violation-card'
                    data-severity={violation_type.violation_severity}
                    className={'violationCard ' +
                                (violation.comment != null ? 'is-resolved ' : '')}>
                    <header>
                        <div className='violationCard-id'>
                            <Link
                                to='violation-vioDetail'
                                params={{
                                    violationId: violation.id
                                }}>{violation.id}
                            </Link>
                        </div>
                        <div>
                            <Icon
                                fixedWidth
                                name='calendar-o'
                                title='Time when this violation was discovered' /> <Timestamp value={violation.timestamp} format={DATE_FORMAT} />
                        </div>
                        <div>
                            <Icon
                                fixedWidth
                                name='cloud'
                                title='The cloud account number' /> {violation.account_id}
                        </div>
                        <div>
                            <Icon
                                fixedWidth
                                name='map-marker'
                                title='Which region this violation happened in' /> {violation.region}
                        </div>
                        {violation.instance_id ?
                            <div>
                                <Icon
                                    fixedWidth
                                    name='server'
                                    title='Which instance caused this violation' /> {violation.instance_id}
                            </div>
                            :
                            null}
                    </header>
                    <table className='table'>
                        <colgroup>
                            <col width='0*' />
                            <col width='0.5*' />
                        </colgroup>
                        <tbody>
                            <tr>
                                <th>Type</th>
                                <td>{violation_type.id}</td>
                            </tr>
                            <tr>
                                <th>Info</th>
                                <td>{violation_type.help_text}</td>
                            </tr>
                            {violation.meta_info ?
                                <tr>
                                    <th>Metadata</th>
                                    <td>
                                        <code>
                                            {violation.meta_info}
                                        </code>
                                    </td>
                                </tr>
                                :
                                null}
                        </tbody>
                    </table>
                    <blockquote className='violationCard-violationMessage'>
                        {violation.message}
                    </blockquote>
                    <footer>
                        {violation.comment ?
                            <div>
                                <span>{violation.last_modified_by} (<Timestamp value={violation.last_modified} relative />):</span>
                                <blockquote className='violationCard-resolutionMessage'>{violation.comment}</blockquote>
                            </div>
                            :
                            this.props.editable ?
                                <form onSubmit={this.resolve.bind(this)} className='form'>
                                    <div className='input-group'>
                                        <input
                                            autoFocus={this.props.autoFocus}
                                            value={this.state.message}
                                            onChange={this.updateMessage.bind(this)}
                                            placeholder='Please explain why it happened.'
                                            type='text' />
                                        <button
                                            type='submit'
                                            className='btn btn-default'>
                                            <Icon name='check' /> Resolve
                                        </button>
                                    </div>
                                </form>
                                :
                                null}
                    </footer>
                </div>;
    }
}
ViolationCard.displayName = 'ViolationCard';
ViolationCard.contextTypes = {
    router: React.PropTypes.func.isRequired
};
ViolationCard.propTypes = {
    autoFocus: React.PropTypes.bool,
    onResolve: React.PropTypes.func,
    violation: React.PropTypes.object.isRequired,
    editable: React.PropTypes.bool,
    flux: React.PropTypes.object.isRequired
};

export default ViolationCard;
