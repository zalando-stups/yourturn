import React from 'react';
import AutoWidth from '@zalando/react-automatic-width';
import Icon from 'react-fa';
import Table from 'fixed-data-table';
import SorTable from 'common/src/sortable-table.jsx';
import Charts from 'react-d3-components';
import _ from 'lodash';
import d3 from 'd3';
import 'common/asset/less/violation/violation-account-overview.less';

class ViolationOverviewAccount extends React.Component {
    constructor() {
        super();
    }

    _selectViolationType(type) {
        this.props.onConfigurationChange({
            groupByApplication: false,
            violationType: type
        });
    }

    _selectApp(app) {
        this.props.onConfigurationChange({
            groupByApplication: true,
            application: app
        });
    }

    render() {
        if (!this.props.violationCount.length) {
            return <div><Icon name='smile-o' /> <span>No violations!</span></div>;
        }
        let groupByApplication = typeof this.props.groupByApplication === 'undefined' ? true : this.props.groupByApplication,
            violationCount = this.props
                                .violationCount
                                .map(v => ({
                                    application: v.application || '',
                                    version: v.version || '',
                                    quantity: v.quantity,
                                    type: v.type,
                                    typeSeverity: this.props.violationTypes[v.type].violation_severity
                                })),
            maxQuantity = violationCount.reduce((prev, cur) => prev > cur.quantity ? prev : cur.quantity, 0),
            yScale = d3.scale.linear()
                        .domain([0, maxQuantity])
                        .range([225, 0])
                        .nice(),
            chartData = groupByApplication ?
                            violationCount.filter(v => v.application === this.props.application) :
                            violationCount.filter(v => v.type === this.props.violationType),
            subject = groupByApplication ?
                        <strong>{this.props.application ? 'App ' + this.props.application : ''}</strong> :
                        <strong>Violation {this.props.violationType}</strong>;
        return <div className='violation-account-overview'>
                    <span>Account {this.props.accounts[this.props.account].name} / {subject}</span>
                    <AutoWidth className='violation-account-overview-chart'>
                        {chartData.length ?
                            <Charts.BarChart
                                data={{
                                    label: 'Violation Count',
                                    values: _.sortByOrder(chartData, ['quantity'], ['desc'])
                                            .map(c => ({
                                                x: (groupByApplication ? c.type : c.application) || '',
                                                y: c.quantity
                                            }))
                                }}
                                tooltipHtml={(x, y0, y) => y.toString()}
                                tooltipMode='element'
                                height={300}
                                margin={{top: 50, left: 50, right: 25, bottom: 25}}
                                yScale={yScale}
                                yAxis={{label: '# Violations', innerTickSize: -10000}} />
                            :
                            null
                        }
                    </AutoWidth>
                    <AutoWidth className='violation-account-overview-table'>
                        <SorTable
                            helpText='You can search for applications, versions and violation types.'
                            height={Math.min((violationCount.length + 1) * 50 + 2, 1500)}
                            filterExprFn={row => `${row.application} ${row.version} ${row.type}`}
                            rows={violationCount}>
                            <Table.Column
                                label='Application'
                                width={200}
                                cellRenderer={c => <span className='sortable-table-highlight' onClick={this._selectApp.bind(this, c)} title={c}>{c}</span>}
                                dataKey='application' />
                            <Table.Column
                                label='Version'
                                width={200}
                                cellRenderer={c => <span title={c}>{c}</span>}
                                dataKey='version' />
                            <Table.Column
                                label='Violation Type'
                                width={200}
                                flexGrow={3}
                                cellRenderer={c => <span className='sortable-table-highlight' onClick={this._selectViolationType.bind(this, c)} title={c}>{c}</span>}
                                dataKey='type' />
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
                                dataKey='quantity' />
                        </SorTable>
                    </AutoWidth>
                </div>;
    }
}
ViolationOverviewAccount.displayName = 'ViolationOverviewAccount';
ViolationOverviewAccount.propTypes = {
    groupByApplication: React.PropTypes.bool,
    violationType: React.PropTypes.string,
    account: React.PropTypes.string,
    accounts: React.PropTypes.object,
    application: React.PropTypes.string,
    violationCount: React.PropTypes.array,
    violationTypes: React.PropTypes.object,
    onConfigurationChange: React.PropTypes.func
};


export default ViolationOverviewAccount;
