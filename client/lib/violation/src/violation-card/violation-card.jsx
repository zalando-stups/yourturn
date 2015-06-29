import React from 'react';
import {Link} from 'react-router';
import Icon from 'react-fa';
import Timestamp from 'react-time';
import FetchResult from 'common/src/fetch-result';
import DefaultError from 'common/src/error.jsx';
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
        this
        .props
        .flux
        .getActions('fullstop')
        .resolveViolation(
            violation.id,
            message);
    }

    render() {
        let {violation} = this.props;
        if (violation instanceof FetchResult) {
            return violation.isPending() ?
                    <Icon name='circle-o-notch' spin /> :
                    <DefaultError error={violation.getResult()} />;
        }
        return <div className={'violationCard ' + (violation.comment != null ? 'is-resolved' : '')}>
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
                    </header>
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
                            <form onSubmit={this.resolve.bind(this)} className='form'>
                                <div className='input-group'>
                                    <input
                                        autoFocus={this.props.autoFocus}
                                        value={this.state.message}
                                        onChange={this.updateMessage.bind(this)}
                                        placeholder='This is expected because I tested things.'
                                        type='text' />
                                    <button
                                        type='submit'
                                        className='btn btn-default'>
                                        <Icon name='check' /> Resolve
                                    </button>
                                </div>
                            </form>}
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
    violation: React.PropTypes.object.isRequired,
    flux: React.PropTypes.object.isRequired
};

export default ViolationCard;
