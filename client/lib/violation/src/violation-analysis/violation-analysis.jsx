import React from 'react';
import Icon from 'react-fa';
import moment from 'moment';
import _ from 'lodash';
import d3 from 'd3';
import Charts from 'react-d3-components';
import AutoWidth from '@zalando/react-automatic-width';
import Table from 'fixed-data-table';
import SortableTable from 'common/src/sortable-table.jsx';
import {merge} from 'common/src/util';
import 'common/asset/less/violation/violation-analysis.less';

class ViolationAnalysis extends React.Component {
    constructor(props) {
        super();
        this.stores = {
            fullstop: props.fullstopStore,
            team: props.teamStore,
            user: props.userStore
        };
        this.actions = props.fullstopActions;
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

    selectAccount(account) {
        this.updateSearch({
            inspectedAccount: account
        });
    }

    accountCellRenderer(account) {
        return <span
                    title={account}
                    className='violation-analysis-table-cell-account'
                    onClick={this.selectAccount.bind(this, account)}>{account}</span>;
    }

    render() {
        let searchParams = this.stores.fullstop.getSearchParams(),
            violationCount = this.stores.fullstop.getViolationCount(),
            chartData = [];

        if (searchParams.accounts.length && violationCount.length) {
            violationCount = violationCount.map(c => ({
                                    type: c.type,
                                    typeHelp: this.stores.fullstop.getViolationType(c.type).help_text,
                                    typeSeverity: this.stores.fullstop.getViolationType(c.type).violation_severity,
                                    account: c.account,
                                    accountName: this.stores.team.getAccount(c.account) ? this.stores.team.getAccount(c.account).name : '?',
                                    quantity: c.quantity
                                }));
            chartData = violationCount.filter(c => c.account === searchParams.inspectedAccount);
            let maxQuantity = chartData.reduce((prev, cur) => prev > cur.quantity ? prev : cur.quantity, 0),
                yScale = d3.scale.linear().domain([0, maxQuantity]).range([225, 0]).nice();

            return <div className='violation-analysis'>
                    {chartData.length ?
                        <AutoWidth className='violation-analysis-chart'>
                            <strong>Account {this.stores.team.getAccount(searchParams.inspectedAccount).name}</strong>
                            <Charts.BarChart
                                data={{
                                    label: 'Violation Count',
                                    values: _.sortByOrder(chartData, ['quantity'], ['desc'])
                                            .map(c => ({ x: c.type, y: c.quantity }))
                                }}
                                tooltipHtml={(x, y0, y) => y.toString()}
                                tooltipMode='element'
                                height={300}
                                margin={{top: 50, left: 50, right: 25, bottom: 25}}
                                yScale={yScale}
                                yAxis={{label: '# Violations', innerTickSize: -10000}} />
                        </AutoWidth>
                        :
                        null}
                        <AutoWidth className='violation-analysis-table'>
                            <SortableTable
                                filterExprFn={row => `${row.type} ${row.account} ${row.accountName}`.toLowerCase()}
                                height={Math.min((violationCount.length + 1) * 50 + 2, 1500)}
                                rows={violationCount}>
                                <Table.Column
                                    label='ID'
                                    width={160}
                                    cellRenderer={this.accountCellRenderer.bind(this)}
                                    dataKey={'account'} />
                                <Table.Column
                                    label='Account'
                                    width={200}
                                    cellRenderer={c => <span title={c}>{c}</span>}
                                    dataKey={'accountName'} />
                                <Table.Column
                                    label='Violation Type'
                                    width={200}
                                    flexGrow={3}
                                    cellRenderer={c => <span title={c}>{c}</span>}
                                    dataKey={'type'} />
                                <Table.Column
                                    label='Severity'
                                    width={100}
                                    flexGrow={1}
                                    cellRenderer={c => <span title={c} className={'sortable-table-align-right ' + 'violation-severity-' + c}>{c}</span>}
                                    dataKey='typeSeverity' />
                                <Table.Column
                                    label='Count'
                                    width={100}
                                    flexGrow={1}
                                    cellRenderer={c => <span title={c} className='sortable-table-align-right'>{c}</span>}
                                    dataKey={'quantity'} />
                            </SortableTable>
                        </AutoWidth>
                    </div>;
        }

        return <div className='violation-analysis-empty'>
                    <div><Icon name='smile-o' size='4x' /></div>
                    <span>No violations!</span>
                </div>;
    }
}
ViolationAnalysis.displayName = 'ViolationAnalysis';
ViolationAnalysis.propTypes = {
    fullstopStore: React.PropTypes.object.isRequired,
    teamStore: React.PropTypes.object.isRequired,
    userStore: React.PropTypes.object.isRequired
};
ViolationAnalysis.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default ViolationAnalysis;
