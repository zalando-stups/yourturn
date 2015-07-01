import React from 'react';
import Icon from 'react-fa';
import Timestamp from 'react-time';
import Daypicker from 'react-day-picker';
import Infinite from 'react-infinite-scroll';
import moment from 'moment';
import {DATE_FORMAT} from 'common/src/config';
import Violation from 'violation/src/violation-card/violation-card.jsx';
import 'common/asset/less/violation/violation-list.less';

const InfiniteList = Infinite(React);

class ViolationList extends React.Component {
    constructor(props) {
        super();
        this.stores = {
            fullstop: props.flux.getStore('fullstop'),
            user: props.globalFlux.getStore('user')
        };
        this.actions = props.flux.getActions('fullstop');
        this.state = {
            showingResolved: false,
            dispatching: false,
            showingAccounts: this.stores.user.getUserCloudAccounts().map(a => a.id),
            showingSince: moment().subtract(1, 'week').startOf('day'),
            accountIds: this.stores.user.getUserCloudAccounts().map(a => a.id)
        };
        this.dayPickerModifiers = {
            disabled: day => day.getTime() > Date.now(),
            selected: day => day.toISOString() === this.state.showingSince.toISOString()
        };
    }

    componentWillMount() {
        this.loadMore(0);
    }

    showResolved(showResolved) {
        this.setState({
            showingResolved: showResolved
        });
    }

    showSince(evt, day) {
        this.setState({
            showingSince: day
        });
        this.actions.fetchViolations(this.stores.user.getUserCloudAccounts().map(a => a.id), day.toISOString());
    }

    toggleAccount(accountId) {
        let {showingAccounts} = this.state,
            index = showingAccounts.indexOf(accountId);
        if (index >= 0) {
            // remove
            showingAccounts.splice(index, 1);
        } else {
            // add
            showingAccounts.push(accountId);
        }
        this.setState({
            showingAccounts: showingAccounts
        });
    }

    loadMore(page) {
        let {showingSince, accountIds, dispatching} = this.state;
        // need to keep track of which action was already dispatched
        if (!dispatching) {
            this.setState({
                dispatching: true
            });
            this
            .actions
            .fetchViolations(accountIds, showingSince, 10, page)
            .then(() => this.setState({
                dispatching: false
            }));
        }
    }

    render() {
        let {showingResolved, showingAccounts, accountIds} = this.state,
            unresolvedViolations = this.stores.fullstop.getViolations(showingAccounts, false),
            resolvedViolations = this.stores.fullstop.getViolations(showingAccounts, true),
            violations = showingResolved ? resolvedViolations : unresolvedViolations,
            pagingInfo = this.stores.fullstop.getPagingInfo(),
            violationElements = violations.map((v, i) => <Violation
                                        key={v.id}
                                        autoFocus={i === 0}
                                        flux={this.props.flux}
                                        violation={v} />);
        return <div className='violationList'>
                    <h2 className='violationList-headline'>Violations</h2>
                    <div className='u-info'>
                        Violations of the STUPS policy and bad practices in accounts you have access to.
                    </div>
                    <div className='violationList-accounts'>
                        <div>Show violations in these accounts:</div>
                        {accountIds.sort().map(a =>
                            <label className={showingAccounts.indexOf(a) >= 0 ? 'is-checked' : ''}>
                                <input
                                    type="checkbox"
                                    value={a}
                                    onChange={this.toggleAccount.bind(this, a)}
                                    defaultChecked={showingAccounts.indexOf(a) >= 0}/> {a}
                            </label>)}
                    </div>
                    <div>
                        Show violations since this date:
                    </div>
                    <Daypicker
                        modifiers={this.dayPickerModifiers}
                        onDayClick={this.showSince.bind(this)}
                        enableOutsideDays={true} />
                    <div className='violationList-info'>
                        Showing {violationElements.length}/{pagingInfo.total_elements} violations since <Timestamp format={DATE_FORMAT} value={this.state.showingSince} />.
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
                    <InfiniteList
                        pageStart={pagingInfo.page}
                        loadMore={this.loadMore.bind(this)}
                        hasMore={!pagingInfo.last}
                        loader={<Icon spin name='circle-o-notch' />}>
                        {violationElements}
                    </InfiniteList>
                </div>;
    }
}
ViolationList.displayName = 'ViolationList';
ViolationList.propTypes = {
    flux: React.PropTypes.object.isRequired
};

export default ViolationList;
