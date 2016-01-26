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

import 'common/asset/less/violation/violation.less';
import 'common/asset/css/react-select.css';
import 'common/asset/less/common/tabs.less';

function sortAsc(a, b) {
    return a.timestamp < b.timestamp ?
            -1 : b.timestamp < a.timestamp ?
              1 : 0;
}

function sortDesc(a, b) {
    return a.timestamp > b.timestamp ?
            -1 : b.timestamp > a.timestamp ?
              1 : 0;
}

class Violation extends React.Component {
    constructor(props, context) {
        super();

        this.state = {
            selectedAccounts: props.userStore.getUserCloudAccounts()
        };
    }

    toggleAccount(activeAccountIds) {
        // check if inspected account is still active
        let searchParams = this.props.fullstopStore.getSearchParams();
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
        this.props.fullstopActions.updateSearchParams({
            page: page
        });
        this.props.fullstopActions.fetchViolations(this.props.fullstopStore.getSearchParams());
    }

    _handleCopy() {
        this.props.notificationActions.addNotification('Copied URL to clipboard', 'info');
    }

    _selectTab(current) {
        this.updateSearch({
            activeTab: current
        });
    }

    _setSortDir(asc) {
        this.updateSearch({
            sortAsc: asc,
            page: 0
        });
    }

    _toggleShowResolved(type) {
        let searchParams = this.props.fullstopStore.getSearchParams(),
            newParams = {};
        newParams['show' + type] = !searchParams['show' + type];
        newParams.page = 0;
        this.updateSearch(newParams);
    }

    _updateSearch(tab, params) {
        let newParams;
        if (tab !== 'list') {
            newParams = Object.keys(params).reduce((prev, cur) => {
                prev[tab + '_' + cur] = params[cur];
                return prev;
            }, {});
        } else {
            // this is a direct link to third tab
            // with filters already set
            newParams = {
                accounts: [params.account],
                activeTab: 2,
                list_violationType: params.type
            };
        }
        this.updateSearch(newParams);
    }

    _filterViolationType(type) {
        this.updateSearch({
            list_violationType: type,
            page: 0
        });
    }

    updateSearch(params, context = this.context, actions = this.props.fullstopActions) {
        actions.deleteViolations();
        actions.updateSearchParams(params);
        Object.keys(params).forEach(k => {
            if (moment.isMoment(params[k])) {
                // dates have to parsed to timestamp again
                params[k] = params[k].toISOString();
            }
        });
        context.router.push('/violation', {}, merge(this.props.location.query, params));
    }

    render() {
        let searchParams = this.props.fullstopStore.getSearchParams(),
            {selectedAccounts} = this.state,
            selectableAccounts = this.props.teamStore.getAccounts(),
            allAccounts = selectableAccounts.reduce((prev, cur) => {
                prev[cur.id] = cur;
                return prev;
            }, {}),
            teamAliase = this.props.teamStore.getAliase(),
            activeAccountIds = searchParams.accounts,
            showingSince = searchParams.from,
            showingUntil = searchParams.to,
            // violations are sorted by id, kind of, if at all, by default
            violations = this.props.fullstopStore.getViolations()
                            .filter(v => !!v.id)    // remove fetch results
                            .sort(searchParams.sortAsc ? sortAsc : sortDesc)
                            .map(v => v.id),
            pagingInfo = this.props.fullstopStore.getPagingInfo(),
            shortURL = window.location.origin + '/violation/v/' + lzw.compressToEncodedURIComponent(JSON.stringify(searchParams)),
            shareURL = shortURL.length < window.location.href.length ? shortURL : window.location.href,
            violationTypes = this.props.fullstopStore.getViolationTypes(),
            violationCards = violations.map(v => <ViolationDetail
                                                    key={v}
                                                    fullstopStore={this.props.fullstopStore}
                                                    fullstopActions={this.props.fullstopActions}
                                                    userStore={this.props.userStore}
                                                    teamStore={this.props.teamStore}
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
                                tableSortBy={searchParams.cross_sortBy}
                                tableSortOrder={searchParams.cross_sortOrder}
                                groupByAccount={searchParams.cross_groupByAccount}
                                account={searchParams.cross_inspectedAccount || activeAccountIds[0]}
                                violationType={searchParams.cross_violationType || null}
                                accounts={allAccounts}
                                teamAliase={teamAliase}
                                onConfigurationChange={this._updateSearch.bind(this, 'cross')}
                                onRequestViewChange={this._updateSearch.bind(this, 'list')}
                                violationTypes={violationTypes}
                                violationCount={this.props.fullstopStore.getViolationCount()} />
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
                                violationCount={this.props.fullstopStore.getViolationCountIn(searchParams.cross_inspectedAccount || activeAccountIds[0])} />
                        </Tabs.TabPanel>
                        <Tabs.TabPanel>
                            <small>Change sort order of violations:</small>
                            <div className='btn-group'>
                                <div className='btn btn-default'
                                    onClick={this._setSortDir.bind(this, true)}
                                    data-selected={searchParams.sortAsc}>
                                    <Icon fixedWidth name='sort-numeric-asc' /> Oldest first
                                </div>
                                <div className='btn btn-default'
                                    onClick={this._setSortDir.bind(this, false)}
                                    data-selected={!searchParams.sortAsc}>
                                    <Icon fixedWidth name='sort-numeric-desc' /> Newest first
                                </div>
                            </div>
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
    router: React.PropTypes.object
};

export default Violation;
