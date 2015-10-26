import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import Datepicker from 'common/src/datepicker.jsx';
import AccountSelector from 'violation/src/account-selector.jsx';
import Charts from 'react-d3-components';
import Collapsible from 'common/src/collapsible.jsx';
import AutoWidth from 'common/src/automatic-width.jsx';
import Table from 'fixed-data-table';
import SortableTable from 'common/src/sortable-table.jsx';
import {merge} from 'common/src/util';
import 'common/asset/less/violation/violation-overview.less';

class ViolationOverview extends React.Component {
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
            selectedAccounts = this.stores.user.getUserCloudAccounts(), // these the user has access to
            inspectedAccount = this.stores.fullstop.getSearchParams().inspectedAccount; // this the user has selected for the chart

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
            inspectedAccount = inspectedAccount || selectedAccounts[0].id;
            this.updateSearch({
                inspectedAccount
            }, context);
        } else {
            Array.prototype.push.apply(activeAccountIds, selectedAccounts.map(a => a.id));
            this.updateSearch({
                accounts: activeAccountIds,
                inspectedAccount: inspectedAccount || activeAccountIds[0]
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
            from: moment(day),
            page: 0
        });
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
                params[k] = params[k].toISOString();
            }
        });
        context.router.transitionTo('violation-vioList', {}, merge(context.router.getCurrentQuery(), params));
    }

    toggleAccount(activeAccountIds) {
        this.updateSearch({
            accounts: activeAccountIds,
            page: 0
        });
    }

    selectAccount(account) {
        this.updateSearch({
            inspectedAccount: account
        });
    }

    accountCellRenderer(account) {
        return <span
                    className='violation-overview-table-cell-account'
                    onClick={this.selectAccount.bind(this, account)}>{account}</span>;
    }

    render() {
        let {selectedAccounts} = this.state,
            searchParams = this.stores.fullstop.getSearchParams(),
            selectableAccounts = this.stores.team.getAccounts(),
            activeAccountIds = searchParams.accounts,
            showingSince = searchParams.from.toDate(),
            violationCount = this.stores.fullstop
                                .getViolationCount()
                                .map(c => ({
                                    type: c.type,
                                    typeHelp: this.stores.fullstop.getViolationType(c.type).help_text,
                                    typeSeverity: this.stores.fullstop.getViolationType(c.type).violation_severity,
                                    account: c.account,
                                    accountName: this.stores.team.getAccount(c.account).name,
                                    quantity: c.quantity
                                })),
            chartData = violationCount.filter(c => c.account === searchParams.inspectedAccount);

        return <div className='violation-overview'>
                    <AccountSelector
                        selectableAccounts={selectableAccounts}
                        selectedAccounts={selectedAccounts}
                        activeAccountIds={activeAccountIds}
                        onToggleAccount={this.toggleAccount.bind(this)} />
                    <div>
                        Show violations since:
                    </div>
                    <Datepicker
                        onChange={this.showSince.bind(this)}
                        selectedDay={showingSince} />
                    <Collapsible
                        className='violation-overview-collapsible'
                        header={<strong>Analysis</strong>}>
                        <AutoWidth className='violation-overview-table'>
                            <SortableTable
                                rows={violationCount}>
                                <Table.Column
                                    cellRenderer={this.accountCellRenderer.bind(this)}
                                    label='ID'
                                    width={200}
                                    flexGrow={1}
                                    dataKey={'account'} />
                                <Table.Column
                                    label='Account'
                                    width={200}
                                    flexGrow={1}
                                    dataKey={'accountName'} />
                                <Table.Column
                                    label='Violation Type'
                                    width={200}
                                    flexGrow={1}
                                    dataKey={'type'} />
                                <Table.Column
                                    label=':('
                                    width={50}
                                    flexGrow={1}
                                    dataKey='typeSeverity' />
                                <Table.Column
                                    label='#'
                                    width={100}
                                    dataKey={'quantity'} />
                            </SortableTable>
                        </AutoWidth>

                        {chartData.length ?
                            <AutoWidth className='violation-overview-chart'>
                                <strong>Violations in {this.stores.team.getAccount(searchParams.inspectedAccount).name} account</strong>
                                <Charts.BarChart
                                    data={{
                                        label: 'Violation Count',
                                        values: _.sortBy(chartData, 'quantity')
                                                .reverse()
                                                .map(c => ({ x: c.type, y: c.quantity }))
                                    }}
                                    tooltipHtml={(x, y0, y) => y.toString()}
                                    tooltipMode='element'
                                    height={300}
                                    margin={{top: 25, left: 50, right: 25, bottom: 25}}
                                    yAxis={{label: '# Violations'}} />
                            </AutoWidth>
                            :
                            null}
                    </Collapsible>
                </div>;
    }
}
ViolationOverview.displayName = 'ViolationOverview';
ViolationOverview.propTypes = {
    fullstopStore: React.PropTypes.object.isRequired,
    teamStore: React.PropTypes.object.isRequired,
    userStore: React.PropTypes.object.isRequired
};
ViolationOverview.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default ViolationOverview;
