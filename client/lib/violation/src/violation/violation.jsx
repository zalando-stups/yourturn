import React from 'react';
import Icon from 'react-fa';
import Tabs from 'react-tabs';
import Select from 'react-select';
import Infinityyy from 'common/src/infinity.jsx';
import moment from 'moment';
import lzw from 'lz-string';
import {merge} from 'common/src/util';
import Datepicker from 'common/src/datepicker.jsx';
import Collapsible from 'common/src/collapsible.jsx';
import Clipboard from 'react-copy-to-clipboard';
import AccountOverview from 'violation/src/violation-overview-account/violation-overview-account.jsx';
import AccountSelector from 'violation/src/account-selector.jsx';
import ViolationAnalysis from 'violation/src/violation-analysis/violation-analysis.jsx';
import ViolationDetail from 'violation/src/violation-detail/violation-detail.jsx';
import 'promise.prototype.finally';
import 'common/asset/less/violation/violation.less';
import 'common/asset/css/react-select.css';

class Violation extends React.Component {
    constructor(props, context) {
        super();
        this.stores = {
            fullstop: props.fullstopStore,
            team: props.teamStore,
            user: props.userStore
        };
        this.actions = props.fullstopActions;
        // make initial list of accounts
        let searchParams = this.stores.fullstop.getSearchParams(),
            selectableAccounts = this.stores.team.getAccounts(), // these we can in theory select
            activeAccountIds = searchParams.accounts, // these are actively searched for
            selectedAccounts = this.stores.user.getUserCloudAccounts(); // these the user has access to

        // situation:
        // we want to preselect accounts that the user has access to
        // BUT the accounts are not necessarily available when the transition hook from router is fired
        // so we do another redirect here if necessary
        if (!activeAccountIds.length) {
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
            activeAccountIds = selectedAccounts.map(a => a.id);
            context.router.transitionTo('violation', {}, merge(context.router.getCurrentQuery(), {
                accounts: activeAccountIds
            }));
        } else {
            selectedAccounts = selectableAccounts.filter(acc => activeAccountIds.indexOf(acc.id) >= 0);
        }
        this.state = {
            selectedAccounts
        };
    }

    toggleAccount(activeAccountIds) {
        // check if inspected account is still active
        let searchParams = this.stores.fullstop.getSearchParams();
        if (searchParams.cross && activeAccountIds.indexOf(searchParams.cross.inspectedAccount) >= 0) {
            this.updateSearch({
                accounts: activeAccountIds,
                page: 0
            });
        } else {
            this.updateSearch({
                accounts: activeAccountIds,
                page: 0,
                cross_inspectedAccount: activeAccountIds[0]
            });
        }
    }

    showSince(day) {
        this.updateSearch({
            from: moment(day),
            page: 0
        });
    }

    showUntil(day) {
        this.updateSearch({
            to: moment(day),
            page: 0
        });
    }

    /**
     * Used by infinite list, used to fetch next page of results.
     *
     * @param  {Number} page The page to fetch
     */
    loadMore(page) {
        this.actions.updateSearchParams({
            page: page
        });
        this.actions.fetchViolations(this.stores.fullstop.getSearchParams());
    }

    _handleCopy() {
        this.props.notificationActions.addNotification('Copied URL to clipboard', 'info');
    }

    _selectTab(current) {
        this.updateSearch({
            activeTab: current
        });
    }

    _toggleShowResolved(type) {
        let searchParams = this.stores.fullstop.getSearchParams(),
            newParams = {};
        newParams['show' + type] = !searchParams['show' + type];
        newParams.page = 0;
        this.updateSearch(newParams);
    }

    _updateSearch(tab, params) {
        let newParams = Object.keys(params).reduce((prev, cur) => {
            prev[tab + '_' + cur] = params[cur];
            return prev;
        }, {});
        this.updateSearch(newParams);
    }

    _filterViolationType(type) {
        this.updateSearch({
            list_violationType: type,
            page: 0
        });
    }

    updateSearch(params, context = this.context, actions = this.actions) {
        actions.deleteViolations();
        actions.updateSearchParams(params);
        Object.keys(params).forEach(k => {
            if (moment.isMoment(params[k])) {
                // dates have to parsed to timestamp again
                params[k] = params[k].toISOString();
            }
        });
        context.router.transitionTo('violation', {}, merge(context.router.getCurrentQuery(), params));
    }

    render() {
        let searchParams = this.stores.fullstop.getSearchParams(),
            {selectedAccounts} = this.state,
            selectableAccounts = this.stores.team.getAccounts(),
            allAccounts = selectableAccounts.reduce((prev, cur) => {
                prev[cur.id] = cur;
                return prev;
            }, {}),
            activeAccountIds = searchParams.accounts,
            showingSince = searchParams.from.toDate(),
            showingUntil = searchParams.to.toDate(),
            violations = this.stores.fullstop.getViolations().filter(v => !!v.id).map(v => v.id),
            pagingInfo = this.stores.fullstop.getPagingInfo(),
            shortURL = window.location.origin + '/violation/v/' + lzw.compressToEncodedURIComponent(JSON.stringify(searchParams)),
            shareURL = shortURL.length < window.location.href.length ? shortURL : window.location.href,
            violationTypes = this.stores.fullstop.getViolationTypes(),
            violationCards = violations.map(v => <ViolationDetail
                                                    key={v}
                                                    fullstopStore={this.props.fullstopStore}
                                                    fullstopActions={this.props.fullstopActions}
                                                    userStore={this.props.userStore}
                                                    violationId={v} />);
        return <div className='violation'>
                    <h2 className='violation-headline'>Violations</h2>
                    <div className='u-info'>
                        Violations of the STUPS policy and bad practices in accounts you have access to.
                    </div>
                    <Clipboard
                        onCopy={this._handleCopy.bind(this)}
                        text={shareURL}>
                        <div className='btn btn-default violation-copy-url'>
                            <Icon name='bullhorn' /> Copy sharing URL
                        </div>
                    </Clipboard>
                    <Collapsible
                        header='Filters'>
                        <div className='violation-filter'>
                            <small>Show violations between:</small>
                            <div className='violation-datepicker violation-btn-group'>
                                <Datepicker
                                    onChange={this.showSince.bind(this)}
                                    selectedDay={showingSince} />
                                <Datepicker
                                    onChange={this.showUntil.bind(this)}
                                    selectedDay={showingUntil} />
                            </div>
                        </div>
                        <div className='violation-filter'>
                            <small>You can filter by resolved or unresolved violations.</small>
                            <div className='violation-btn-group'>
                                <div
                                    data-selected={searchParams.showResolved}
                                    onClick={this._toggleShowResolved.bind(this, 'Resolved')}
                                    className='btn btn-default'>
                                    <Icon name='check-circle' /> Show resolved
                                </div>
                                <div
                                    data-selected={searchParams.showUnresolved}
                                    onClick={this._toggleShowResolved.bind(this, 'Unresolved')}
                                    className='btn btn-default'>
                                    <Icon name='circle-o' /> Show unresolved
                                </div>
                            </div>
                        </div>
                        <div className='violation-filter'>
                            <AccountSelector
                                selectableAccounts={selectableAccounts}
                                selectedAccounts={selectedAccounts}
                                activeAccountIds={activeAccountIds}
                                onToggleAccount={this.toggleAccount.bind(this)} />
                        </div>
                    </Collapsible>

                    <Tabs.Tabs
                        onSelect={this._selectTab.bind(this)}
                        selectedIndex={searchParams.activeTab}>
                        <Tabs.TabList>
                            <Tabs.Tab>Cross-Account Analysis</Tabs.Tab>
                            <Tabs.Tab>Account Analysis</Tabs.Tab>
                            <Tabs.Tab>Violations</Tabs.Tab>
                        </Tabs.TabList>
                        <Tabs.TabPanel>
                            <ViolationAnalysis
                                groupByAccount={searchParams.cross_groupByAccount}
                                account={searchParams.cross_inspectedAccount || activeAccountIds[0]}
                                violationType={searchParams.cross_violationType || null}
                                accounts={allAccounts}
                                onConfigurationChange={this._updateSearch.bind(this, 'cross')}
                                violationTypes={violationTypes}
                                violationCount={this.stores.fullstop.getViolationCount()} />
                        </Tabs.TabPanel>
                        <Tabs.TabPanel>
                            <AccountOverview
                                onConfigurationChange={this._updateSearch.bind(this, 'single')}
                                account={searchParams.cross_inspectedAccount || activeAccountIds[0]}
                                accounts={allAccounts}
                                groupByApplication={searchParams.single_groupByApplication}
                                application={searchParams.single_application || ''}
                                violationType={searchParams.single_violationType || ''}
                                violationTypes={violationTypes}
                                violationCount={this.stores.fullstop.getViolationCountIn(searchParams.cross_inspectedAccount || activeAccountIds[0])} />
                        </Tabs.TabPanel>
                        <Tabs.TabPanel>
                            <small>You can filter by violation type.</small>
                            <Select
                                className='violation-list-type-filter'
                                placeholder='EC2_WITH_KEYPAIR'
                                value={searchParams.list_violationType || ''}
                                onChange={this._filterViolationType.bind(this)}
                                options={Object.keys(violationTypes).sort().map(vt => ({label: vt, value: vt}))} />
                            <div
                                data-block='violation-list'
                                className='violation-list'>
                                <Infinityyy
                                    scrollOffset={300}
                                    onLoad={this.loadMore.bind(this)}
                                    hasMore={!pagingInfo.last}
                                    lastPage={pagingInfo.page}
                                    loader={<Icon spin name='circle-o-notch u-spinner' />}>
                                    {violationCards.length ?
                                        violationCards :
                                        <div>
                                            <Icon name='smile-o' /> <span>No violations!</span>
                                        </div>}
                                </Infinityyy>
                            </div>
                        </Tabs.TabPanel>
                    </Tabs.Tabs>
                </div>;
    }
}
Violation.displayName = 'Violation';
Violation.propTypes = {
    fullstopStore: React.PropTypes.object.isRequired,
    teamStore: React.PropTypes.object.isRequired,
    userStore: React.PropTypes.object.isRequired,
    fullstopActions: React.PropTypes.object.isRequired,
    notificationActions: React.PropTypes.object.isRequired
};
Violation.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default Violation;
