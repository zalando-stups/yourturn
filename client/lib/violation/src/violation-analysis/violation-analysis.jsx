import React from 'react';
import Icon from 'react-fa';
import _ from 'lodash';
import d3 from 'd3';
import Charts from 'react-d3-components';
import AutoWidth from '@zalando/react-automatic-width';
import Table from 'fixed-data-table';
import SortableTable from 'common/src/sortable-table.jsx'
import 'common/asset/less/violation/violation-analysis.less';

class ViolationAnalysis extends React.Component {
    constructor(props) {
        super();
    }

    selectAccount(account) {
        this.props.onConfigurationChange({
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
        let {violationCount, violationTypes} = this.props,
            chartData = [];

        if (violationCount.length) {
            violationCount = violationCount.map(c => ({
                                    type: c.type,
                                    typeHelp: violationTypes[c.type].help_text,
                                    typeSeverity: violationTypes[c.type].violation_severity,
                                    account: c.account,
                                    accountName: this.props.accounts[c.account] ? this.props.accounts[c.account].name : '?',
                                    quantity: c.quantity
                                }));
            chartData = violationCount.filter(c => c.account === this.props.account);

            let maxQuantity = chartData.reduce((prev, cur) => prev > cur.quantity ? prev : cur.quantity, 0),
                yScale = d3.scale
                            .linear()
                            .domain([0, maxQuantity])
                            .range([225, 0])
                            .nice();

            return <div className='violation-analysis'>
                    {chartData.length ?
                        <AutoWidth className='violation-analysis-chart'>
                            <strong>Account {this.props.accounts[this.props.account].name}</strong>
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
    violationCount: React.PropTypes.array,
    violationTypes: React.PropTypes.array,
    onConfigurationChange: React.PropTypes.func,
    accounts: React.PropTypes.array,
    account: React.PropTypes.string,
};

export default ViolationAnalysis;
