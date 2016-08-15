import React from 'react';
import Icon from 'react-fa';
import {Link} from 'react-router';
import Timestamp from 'react-time';
import Config from 'common/src/config';
import Badge from 'common/src/badge.jsx'
import 'common/asset/less/violation/violation-card.less';
import * as Routes from 'violation/src/routes';
import ViolationViz from 'violation/src/violation-viz.jsx';
import listenToOutsideClick from 'react-onclickoutside/decorator';

class ViolationCard extends React.Component {
    constructor() {
        super();
        this.state = {
            message: ''
        };
    }

    handleClickOutside() {
        if (this.props.onClickOutside) {
            this.props.onClickOutside();
        }
    }

    updateMessage(evt) {
        this.setState({
            message: evt.target.value
        });
    }

    close() {
        if (this.props.onClose) {
            this.props.onClose();
        }
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
        let {violation, closable} = this.props,
            account = this.props.accounts[violation.account_id],
            {violation_type} = violation;
        return <div
                    style={this.props.style || {}}
                    data-block='violation-card'
                    data-priority={violation_type.priority}
                    className={'violationCard ' +
                                (violation.comment != null ? 'is-resolved ' : '')}>
                    <header>
                        {closable ?
                            <div onClick={this.close.bind(this)}
                                 className='btn btn-default violationCard-close'>
                                <Icon name='times' /> Close</div>
                            : null}
                        <div className='violationCard-id'>
                            <Link
                                to={`${Routes.vioDetail({violationId: violation.id})}`}>{violation.id}
                            </Link>
                        </div>
                        <div>
                            <Icon
                                fixedWidth
                                name='exclamation-triangle'
                                title='Priority' /> <ViolationViz priority={violation_type.priority} />
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
                        {violation.username != null ?
                            <div>
                                <Icon fixedWidth
                                      name='user'
                                      title='Which user caused this violation' /> {violation.username}
                            </div>
                            :
                            null}
                        {violation.rule_id != null ?
                            <div>
                                <Badge>Whitelisted</Badge>
                            </div>
                            :
                            null}
                    </header>
                    <div>
                        <h5>{violation_type.name || violation_type.id}</h5>
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
                            !violation.is_whitelisted && this.props.editable ?
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

// TODO fix accounts
ViolationCard.propTypes = {
    accounts: React.PropTypes.object.isRequired,
    autoFocus: React.PropTypes.bool,
    closable: React.PropTypes.bool,
    editable: React.PropTypes.bool,
    onClickOutside: React.PropTypes.func,
    onClose: React.PropTypes.func,
    onResolve: React.PropTypes.func,
    style: React.PropTypes.object,
    violation: React.PropTypes.shape({
        comment: React.PropTypes.string,
        id: React.PropTypes.number,
        account_id: React.PropTypes.string,
        region: React.PropTypes.string,
        instance_id: React.PropTypes.string,
        username: React.PropTypes.string,
        message: React.PropTypes.string,
        rule_id: React.PropTypes.string,
        meta_info: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object]),
        is_whitelisted: React.PropTypes.bool,
        violation_type: React.PropTypes.shape({
            priority: React.PropTypes.number
        }),
        last_modified_by: React.PropTypes.string,
        timestamp: React.PropTypes.number,
        last_modified: React.PropTypes.string
    }).isRequired
};

export default listenToOutsideClick(ViolationCard);
