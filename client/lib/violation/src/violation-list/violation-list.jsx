import React from 'react';
import Icon from 'react-fa';
import Infinite from 'react-infinite-scroll';
import moment from 'moment';
import {Typeahead} from 'react-typeahead';
import Datepicker from 'common/src/datepicker.jsx';
import Violation from 'violation/src/violation-detail/violation-detail.jsx';
import {merge} from 'common/src/util';
import 'promise.prototype.finally';
import 'common/asset/less/violation/violation-list.less';

const InfiniteList = Infinite(React);

function filterOptionFn(input, option) {
    return input
            .trim()
            .split(' ')
            .some(term => (option.name + option.id).indexOf(term) >= 0);
}

class ViolationList extends React.Component {
    constructor(props, context) {
        super();
        this.stores = {
            fullstop: props.fullstopStore,
            team: props.teamStore,
            user: props.userStore
        };
        this.actions = props.fullstopActions;
        // make initial list of accounts
        let selectableAccounts = this.stores.team.getAccounts(), // these we can in theory select
            activeAccountIds = this.stores.fullstop.getSearchParams().accounts, // these are actively searched for
            selectedAccounts = this.stores.user.getUserCloudAccounts(); // these the user has access to
        // if there are no active account ids, use those of selected accounts
        // otherwise select accounts with active account ids
        //
        // GOD is this confusing
        if (activeAccountIds.length) {
            Array.prototype.push.apply(selectedAccounts, selectableAccounts.filter(a => activeAccountIds.indexOf(a.id) >= 0));
            // deduplicate
            selectedAccounts = selectedAccounts
                                .reduce((accs, cur) => {
                                    if (accs.map(a => a.id).indexOf(cur.id) < 0) {
                                        accs.push(cur);
                                    }
                                    return accs;
                                },
                                []);
        } else {
            Array.prototype.push.apply(activeAccountIds, selectedAccounts.map(a => a.id));
            this.updateSearch({
                accounts: activeAccountIds
            }, context);
        }
        this.state = {
            selectedAccounts,
            dispatching: false
        };
    }

    showSince(day) {
        this.actions.deleteViolations();
        this.updateSearch({
            from: moment(day)
        });
        this.updateSearch({
            page: 0
        });
        this.actions.fetchViolations(this.stores.fullstop.getSearchParams());
    }

    /**
     * Updates search parameters in fullstop store and query params in route.
     * @param  {Object} params  The new params
     * @param  {Object} context Router context
     */
    updateSearch(params, context = this.context) {
        this.actions.updateSearchParams(params);
        Object.keys(params).forEach(k => {
            if (moment.isMoment(params[k])) {
                // dates have to parsed to timestamp again
                params[k] = params[k].toDate();
            }
        });
        context.router.transitionTo('violation-vioList', {}, merge(context.router.getCurrentQuery(), params));
    }

    /**
     * Add or remove this account from search parameters.
     *
     * @param  {String} accountId
     */
    toggleAccount(accountId) {
        let activeAccountIds = this.stores.fullstop.getSearchParams().accounts,
            index = activeAccountIds.indexOf(accountId);
        if (index >= 0) {
            // remove
            activeAccountIds.splice(index, 1);
        } else {
            // add
            activeAccountIds.push(accountId);
        }
        this.updateSearch({
            accounts: activeAccountIds,
            page: 0
        });
        this.actions.fetchViolations(this.stores.fullstop.getSearchParams());
    }

    /**
     * Selects this account, i.e. adds it to list of toggleable accounts.
     *
     * @param  {Object} account
     */
    selectAccount(account) {
        let {id} = account;
        if (this.state.selectedAccounts.map(a => a.id).indexOf(id) >= 0) {
            return;
        }
        this.state.selectedAccounts.push(account);
        this.state.selectedAccounts
            .sort((a, b) => {
                    let aName = a.name.toLowerCase(),
                        bName = b.name.toLowerCase();
                    return aName < bName ?
                            -1 :
                            bName < aName ?
                                1 : 0;
                 });
        let activeAccountIds = this.stores.fullstop.getSearchParams().accounts;
        activeAccountIds.push(id);
        this.updateSearch({
            accounts: activeAccountIds,
            page: 0
        });
        this.setState({
            selectableAccounts: this.state.selectableAccounts
        });
        this.actions.fetchViolations(this.stores.fullstop.getSearchParams());
    }

    /**
     * Used by infinite list, used to fetch next page of results.
     *
     * @param  {Number} page The page to fetch
     */
    loadMore(page) {
        // we get an error if we don't track this ;_;
        if (!this.state.dispatching) {
            this.setState({
                dispatching: true
            });
            this.updateSearch({
                page
            });
            this.actions
            .fetchViolations(this.stores.fullstop.getSearchParams())
            .finally(() => {
                this.setState({
                    dispatching: false
                });
            });
        }
    }

    render() {
        let {selectedAccounts} = this.state,
            searchParams = this.stores.fullstop.getSearchParams(),
            selectableAccounts = this.stores.team.getAccounts(),
            activeAccountIds = searchParams.accounts,
            showingSince = searchParams.from.toDate(),
            violations = this.stores.fullstop.getViolations(activeAccountIds).map(v => v.id),
            pagingInfo = this.stores.fullstop.getPagingInfo(),
            violationCards = violations.map((v, i) => <Violation
                                                        key={v}
                                                        autoFocus={i === 0}
                                                        fullstopStore={this.props.fullstopStore}
                                                        fullstopActions={this.props.fullstopActions}
                                                        userStore={this.props.userStore}
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
                                    options={selectableAccounts}
                                    displayOption={option => `${option.name} (${option.id})`}
                                    filterOption={filterOptionFn}
                                    onOptionSelected={this.selectAccount.bind(this)}
                                    maxVisible={10} />
                            </div>
                            {selectedAccounts.map(a =>
                                <label
                                    key={a.id}
                                    className={activeAccountIds.indexOf(a.id) >= 0 ? 'is-checked' : ''}>
                                    <input
                                        type='checkbox'
                                        value={a.id}
                                        onChange={this.toggleAccount.bind(this, a.id)}
                                        defaultChecked={activeAccountIds.indexOf(a.id) >= 0}/> {a.name} <small>({a.id})</small>
                                </label>)}
                        </div>
                        <div>
                            Show violations since:
                        </div>
                        <Datepicker
                            onChange={this.showSince.bind(this)}
                            selectedDay={showingSince} />
                    </div>
                    <div className='violationList-info'>
                        Fetched {violationCards.length} violations. {pagingInfo.last ? '' : 'Scroll down to load more.'}
                    </div>
                    <div
                        data-block='violation-list'
                        className='violationList-list'>
                        <InfiniteList
                            loadMore={this.loadMore.bind(this)}
                            hasMore={!pagingInfo.last}
                            loader={<Icon spin name='circle-o-notch u-spinner' />}>
                            {violationCards}
                        </InfiniteList>
                    </div>
                </div>;
    }
}
ViolationList.displayName = 'ViolationList';
ViolationList.propTypes = {
    fullstopStore: React.PropTypes.object.isRequired,
    teamStore: React.PropTypes.object.isRequired,
    userStore: React.PropTypes.object.isRequired,
    fullstopActions: React.PropTypes.object.isRequired
};
ViolationList.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default ViolationList;
