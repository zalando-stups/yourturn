import React from 'react';
import Icon from 'react-fa';
import Timestamp from 'react-time';
import {DATE_FORMAT} from 'common/src/config';
import 'common/asset/less/violation/violation-list.less';

class Violation extends React.Component {
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
        return <div className='violation'>
                    <header>
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
                    <blockquote className='violation-violationMessage'>
                        {violation.message}
                    </blockquote>
                    <footer>
                        {violation.comment ?
                            <div>
                                <span>{violation.last_modified_by} (<Timestamp value={violation.last_modified} relative />):</span>
                                <blockquote className='violation-resolutionMessage'>{violation.comment}</blockquote>
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
Violation.displayName = 'Violation';
Violation.propTypes = {
    autoFocus: React.PropTypes.bool,
    violation: React.PropTypes.object.isRequired,
    flux: React.PropTypes.object.isRequired
};

class ViolationList extends React.Component {
    constructor(props) {
        super();
        this.stores = {
            fullstop: props.flux.getStore('fullstop'),
            user: props.globalFlux.getStore('user')
        };
        this.state = {
            showingResolved: false
        };
    }

    showResolved(showResolved) {
        this.setState({
            showingResolved: showResolved
        });
    }

    render() {
        let {showingResolved} = this.state,
            accountIds = this.stores.user.getUserCloudAccounts().map(a => a.id),
            unresolvedViolations = this.stores.fullstop.getViolations(accountIds, false),
            resolvedViolations = this.stores.fullstop.getViolations(accountIds, true),
            violations = showingResolved ? resolvedViolations : unresolvedViolations;
        return <div className='violationList'>
                    <h2 className='violationList-headline'>Violations</h2>
                    <div className='u-info'>
                        Violations of the STUPS policy and bad practices in accounts you have access to.
                    </div>

                    <div className='tabs'>
                        <div
                            onClick={this.showResolved.bind(this, false)}
                            className={'tab ' + (showingResolved ? '' : 'is-active')}>
                            Unresolved <span className='badge'>{unresolvedViolations.length}</span>
                        </div>
                        <div
                            onClick={this.showResolved.bind(this, true)}
                            className={'tab ' + (showingResolved ? 'is-active' : '')}>
                            Resolved <span className='badge'>{resolvedViolations.length}</span>
                        </div>
                    </div>
                    {violations.length ?
                        violations.map((v, i) => <Violation
                                                    key={v.id}
                                                    autoFocus={i === 0}
                                                    flux={this.props.flux}
                                                    violation={v} />)
                        :
                        <span>Wow, no violations! You are a good person.</span>}
                </div>;
    }
}
ViolationList.displayName = 'ViolationList';
ViolationList.propTypes = {
    flux: React.PropTypes.object.isRequired
};

export default ViolationList;