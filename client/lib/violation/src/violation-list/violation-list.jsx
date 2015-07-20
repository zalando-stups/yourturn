import React from 'react';
import Icon from 'react-fa';
import Timestamp from 'react-time';
import Infinite from 'react-infinite-scroll';
import moment from 'moment';
import {DATE_FORMAT} from 'common/src/config';
import Datepicker from 'common/src/datepicker.jsx';
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
            currentPage: 0,
            showingAccounts: this.stores.user.getUserCloudAccounts().map(a => a.id),
            showingSince: moment().subtract(1, 'week').startOf('day').toDate()
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

    showSince(day) {
        this.actions.deleteViolations();
        this.setState({
            showingSince: day,
            currentPage: 0
        });
        setTimeout(() => this.loadMore(0), 0);
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
        setTimeout(() => this.loadMore(0), 0);
    }

    loadMore(page) {
        let {showingSince, showingAccounts, dispatching} = this.state;
        // need to keep track of which action was already dispatched
        if (!dispatching) {
            if (typeof page === 'number') {
                this.setState({
                    dispatching: true
                });
                this
                .actions
                .fetchViolations(showingAccounts, showingSince.toISOString(), 10, page)
                .then(() => this.setState({
                    dispatching: false
                }))
                .catch(() => this.setState({
                    dispatching: false
                }));
            } else if (page === true) {
                // use current page
                page = this.state.currentPage + 1;
                this.setState({
                    currentPage: page,
                    dispatching: true
                });
                this
                .actions
                .fetchViolations(showingAccounts, showingSince.toISOString(), 10, page)
                .then(() => this.setState({
                    dispatching: false
                }))
                .catch(() => this.setState({
                    dispatching: false
                }));
            }
        }
    }

    render() {
        let {showingResolved, showingAccounts} = this.state,
            accounts = this.stores.user.getUserCloudAccounts(),
            unresolvedViolations = this.stores.fullstop.getViolations(showingAccounts, false),
            resolvedViolations = this.stores.fullstop.getViolations(showingAccounts, true),
            violations = showingResolved ? resolvedViolations : unresolvedViolations,
            pagingInfo = this.stores.fullstop.getPagingInfo(),
            violationCards = violations.map((v, i) => <Violation
                                key={v.id}
                                autoFocus={i === 0}
                                flux={this.props.flux}
                                violation={v} />);
        return <div className='violationList'>
                    <h2 className='violationList-headline'>Violations</h2>
                    <div className='u-info'>
                        Violations of the STUPS policy and bad practices in accounts you have access to.
                    </div>
                    <div className='violationList-filtering'>
                        <div className='violationList-accounts'>
                            <div>Show violations in these accounts:</div>
                            {accounts.map(a =>
                                <label className={showingAccounts.indexOf(a.id) >= 0 ? 'is-checked' : ''}>
                                    <input
                                        type="checkbox"
                                        value={a.id}
                                        onChange={this.toggleAccount.bind(this, a.id)}
                                        defaultChecked={showingAccounts.indexOf(a.id) >= 0}/> {a.name} <small>({a.id})</small>
                                </label>)}
                        </div>
                        <div>
                            Show violations since:
                        </div>
                        <Datepicker
                            onChange={this.showSince.bind(this)}
                            selectedDay={this.state.showingSince} />
                    </div>
                    <div className='violationList-info'>
                        Showing {violationCards.length}/{pagingInfo.total_elements} violations since <Timestamp format={DATE_FORMAT} value={this.state.showingSince} />.
                    </div>
                    <div className='tabs'>
                        <div
                            onClick={this.showResolved.bind(this, false)}
                            className={'tab ' + (showingResolved ? '' : 'is-active')}>
                            Unresolved
                        </div>
                        <div
                            onClick={this.showResolved.bind(this, true)}
                            className={'tab ' + (showingResolved ? 'is-active' : '')}>
                            Resolved
                        </div>
                    </div>
                    <div className='violationList-list'>
                        <InfiniteList
                            loadMore={this.loadMore.bind(this, true)}
                            hasMore={!pagingInfo.last}
                            loader={<Icon spin name='circle-o-notch' />}>
                            {violationCards}
                        </InfiniteList>
                    </div>
                </div>;
    }
}
ViolationList.displayName = 'ViolationList';
ViolationList.propTypes = {
    flux: React.PropTypes.object.isRequired
};

export default ViolationList;
