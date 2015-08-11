import React from 'react';
import Icon from 'react-fa';
import Infinite from 'react-infinite-scroll';
import moment from 'moment';
import {Typeahead} from 'react-typeahead';
import Datepicker from 'common/src/datepicker.jsx';
import Violation from 'violation/src/violation-detail/violation-detail.jsx';
import 'common/asset/less/violation/violation-list.less';

const InfiniteList = Infinite(React);

function filterOptionFn(input, option) {
    return input
            .trim()
            .split(' ')
            .some(term => (option.name + option.id).indexOf(term) >= 0);
}

class ViolationList extends React.Component {
    constructor(props) {
        super();
        this.stores = {
            fullstop: props.flux.getStore('fullstop'),
            team: props.flux.getStore('team'),
            user: props.globalFlux.getStore('user')
        };
        this.actions = props.flux.getActions('fullstop');
        this.state = {
            dispatching: false,
            currentPage: 0,
            selectableAccounts: this.stores.user.getUserCloudAccounts(),
            showingAccounts: this.stores.user.getUserCloudAccounts().map(a => a.id),
            showingSince: moment().subtract(1, 'week').startOf('day').toDate()
        };
    }

    componentWillMount() {
        this.loadMore(0);
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

    addAccount(account) {
        let {id} = account;
        if (this.state.selectableAccounts.map(a => a.id).indexOf(id) >= 0) {
            return;
        }
        this.state.selectableAccounts.push(account);
        this.state.selectableAccounts
            .sort((a, b) => {
                    let aName = a.name.toLowerCase(),
                        bName = b.name.toLowerCase();
                    return aName < bName ?
                            -1 :
                            bName < aName ?
                                1 : 0;
                 });
        this.state.showingAccounts.push(id);
        this.setState({
            selectableAccounts: this.state.selectableAccounts,
            showingAccounts: this.state.showingAccounts
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
        let {showingAccounts, selectableAccounts} = this.state,
            accounts = this.stores.team.getAccounts(),
            violations = this.stores.fullstop.getViolations(showingAccounts).map(v => v.id),
            pagingInfo = this.stores.fullstop.getPagingInfo(),
            violationCards = violations.map((v, i) => <Violation
                                                        key={v}
                                                        autoFocus={i === 0}
                                                        flux={this.props.flux}
                                                        globalFlux={this.props.globalFlux}
                                                        violationId={v} />);

        return <div className='violationList'>
                    <h2 className='violationList-headline'>Violations</h2>
                    <div className='u-info'>
                        Violations of the STUPS policy and bad practices in accounts you have access to.
                    </div>
                    <div className='violationList-filtering'>
                        <div className='violationList-accounts'>
                            <div>Show violations in accounts:</div>
                            <small>You can search by name or account number.</small>
                            <div className='input-group'>
                                <Icon name='search' />
                                <Typeahead
                                    placeholder='stups-test 123456'
                                    options={accounts}
                                    displayOption={option => `${option.name} (${option.id})`}
                                    filterOption={filterOptionFn}
                                    onOptionSelected={this.addAccount.bind(this)}
                                    maxVisible={10} />
                            </div>
                            {selectableAccounts.map(a =>
                                <label
                                    key={a.id}
                                    className={showingAccounts.indexOf(a.id) >= 0 ? 'is-checked' : ''}>
                                    <input
                                        type='checkbox'
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
                        Fetched {violationCards.length} violations. {pagingInfo.last ? '' : 'Scroll down to load more.'}
                    </div>
                    <div
                        data-block='violation-list'
                        className='violationList-list'>
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
    flux: React.PropTypes.object.isRequired,
    globalFlux: React.PropTypes.object.isRequired
};

export default ViolationList;
