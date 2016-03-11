import React from 'react';
import Icon from 'react-fa';
import {Link} from 'react-router';
import Timestamp from 'react-time';
import Config from 'common/src/config';
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
        if (!this.props.violation) {
            return null;
        }
        let {violation} = this.props,
            account = this.props.accounts[violation.account_id],
            {violation_type} = violation;
        return <div
                    style={this.props.style || {}}
                    data-block='violation-card'
                    data-severity={violation_type.violation_severity}
                    className={'violationCard ' +
                                (violation.comment != null ? 'is-resolved ' : '')}>
                    <header>
                        <div className='violationCard-id'>
                            <Link
                                to={`/violation/${violation.id}`}>{violation.id}
                            </Link>
                        </div>
                        <div>
                            <Icon
                                fixedWidth
                                name='calendar-o'
                                title='Time when this violation was discovered' /> <Timestamp value={violation.timestamp} format={Config.DATE_FORMAT} />
                        </div>
                        <div>
                            <Icon
                                fixedWidth
                                name='users'
                                title='The team the account belongs to' /> {account && account.owner}
                        </div>
                        <div>
                            <Icon
                                fixedWidth
                                name='cloud'
                                title='The cloud account number' /> {account && account.name} ({violation.account_id})
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
                    <div>
                        <h5>{violation_type.id}</h5>
                        <p>{violation_type.help_text}</p>
                        {!!violation.meta_info ?
                            <code className='violationCard-metadata'>
                                {typeof violation.meta_info === 'string' ?
                                    violation.meta_info :
                                    Object.keys(violation.meta_info)
                                    .map(key => <div key={key}><span className='violationCard-metadata-key'>{key}</span>: {JSON.stringify(violation.meta_info[key])}</div>)}
                            </code>
                            :
                            null}
                    </div>
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
    router: React.PropTypes.object
};
ViolationCard.propTypes = {
    autoFocus: React.PropTypes.bool,
    onResolve: React.PropTypes.func,
    accounts: React.PropTypes.array,
    violation: React.PropTypes.object.isRequired,
    editable: React.PropTypes.bool
};

export default ViolationCard;
