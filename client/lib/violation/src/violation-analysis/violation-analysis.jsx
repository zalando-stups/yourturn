import React from 'react';
import Icon from 'react-fa';
import _ from 'lodash';
import d3 from 'd3';
import Charts from 'react-d3-components';
import AutoWidth from '@zalando/react-automatic-width';
import Table from 'fixed-data-table';
import SortableTable from 'common/src/sortable-table.jsx';
import 'common/asset/less/violation/violation-analysis.less';

class ViolationAnalysis extends React.Component {
    constructor() {
        super();
    }

    selectAccount(account) {
        this.props.onConfigurationChange({
            inspectedAccount: account,
            groupByAccount: true
        });
    }

    selectViolationType(type) {
        this.props.onConfigurationChange({
            groupByAccount: false,
            violationType: type
        });
    }

    selectQuantity(data) {
        this.props.onRequestViewChange(data);
    }

    accountCellRenderer(a, b, data) {
        return <span
                    title={data.accountName}
                    className='sortable-table-highlight'
                    onClick={this.selectAccount.bind(this, data.account)}>{data.accountName}</span>;
    }

    violationTypeCellRenderer(violationType) {
        return <span title={violationType}
                     className='sortable-table-highlight'
                     onClick={this.selectViolationType.bind(this, violationType)}>
                     {violationType}
                </span>;
    }

    quantityCellRenderer(c, name, data) {
        return <span title={c}
                     onClick={this.selectQuantity.bind(this, data)}
                     className='sortable-table-highlight sortable-table-align-right'>{c}</span>;
    }

    render() {
        let {violationCount, violationTypes, groupByAccount} = this.props,
            chartData = [];
        groupByAccount = groupByAccount === undefined ? true : groupByAccount;
        if (!violationCount.length) {
            return <div><Icon name='smile-o' /> <span>No violations!</span></div>;
        }
        violationCount = violationCount.map(c => ({
                                type: c.type,
                                typeHelp: violationTypes[c.type].help_text,
                                typeSeverity: violationTypes[c.type].violation_severity,
                                account: c.account,
                                accountName: this.props.accounts[c.account] ? this.props.accounts[c.account].name : '?',
                                quantity: c.quantity
                            }));
        chartData = groupByAccount ?
                        violationCount.filter(c => c.account === this.props.account) :
                        violationCount.filter(c => c.type === this.props.violationType);

        let maxQuantity = chartData.reduce((prev, cur) => prev > cur.quantity ? prev : cur.quantity, 0),
            yScale = d3.scale
                        .linear()
                        .domain([0, maxQuantity])
                        .range([225, 0])
                        .nice();

        return <div className='violation-analysis'>
                {chartData.length ?
                    <AutoWidth className='violation-analysis-chart'>
                        <strong>
                            {groupByAccount ?
                                <span>Account {this.props.accounts[this.props.account] ? this.props.accounts[this.props.account].name : '?'}</span> :
                                <span>Violation {this.props.violationType}</span>}
                        </strong>
                        <Charts.BarChart
                            data={{
                                label: 'Violation Count',
                                values: _.sortByOrder(chartData, ['quantity'], ['desc'])
                                        .map(c => ({ x: groupByAccount ? c.type : c.accountName, y: c.quantity }))
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
                            helpText='You can search for accounts and violation types.'
                            filterExprFn={row => `${row.type} ${row.account} ${row.accountName}`.toLowerCase()}
                            height={Math.min((violationCount.length + 1) * 50 + 2, 1500)}
                            rows={violationCount}>
                            <Table.Column
                                label='ID'
                                width={160}
                                cellRenderer={account => <span className='sortable-table-highlight' onClick={this.selectAccount.bind(this, account)}>{account}</span>}
                                dataKey={'account'} />
                            <Table.Column
                                label='Account'
                                width={200}
                                cellRenderer={this.accountCellRenderer.bind(this)}
                                dataKey={'accountName'} />
                            <Table.Column
                                label='Violation Type'
                                width={200}
                                flexGrow={3}
                                cellRenderer={this.violationTypeCellRenderer.bind(this)}
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
                                cellRenderer={this.quantityCellRenderer.bind(this)}
                                dataKey={'quantity'} />
                        </SortableTable>
                    </AutoWidth>
                </div>;
    }
}
ViolationAnalysis.displayName = 'ViolationAnalysis';
ViolationAnalysis.propTypes = {
    groupByAccount: React.PropTypes.bool,
    violationType: React.PropTypes.string,
    violationCount: React.PropTypes.array,
    violationTypes: React.PropTypes.array,
    onConfigurationChange: React.PropTypes.func,
    accounts: React.PropTypes.array,
    account: React.PropTypes.string
};

export default ViolationAnalysis;
