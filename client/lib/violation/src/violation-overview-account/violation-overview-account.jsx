import React from 'react';
import AutoWidth from '@zalando/react-automatic-width';
import Table from 'fixed-data-table';
import SorTable from 'common/src/sortable-table.jsx';
import Collapsible from 'common/src/collapsible.jsx';
import Charts from 'react-d3-components';
import d3 from 'd3';
import 'common/asset/less/violation/violation-account-overview.less';

class ViolationOverviewAccount extends React.Component {
    constructor(props) {
        super();
    }

    _selectApp(app) {
        this.props.onConfigurationChange({
            application: app
        });
    }

    render() {
        let violationCount = this.props
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
                        .nice();
        return <div className='violation-account-overview'>
                    <strong>Account {this.props.account} {this.props.application || ''}</strong>
                    {violationCount.length ?
                        <div>
                            <AutoWidth className='violation-account-overview-chart'>
                                <Charts.BarChart
                                    data={{
                                        label: 'Violation Count',
                                        values: _.sortByOrder(violationCount, ['quantity'], ['desc'])
                                                .map(c => ({ x: c.type, y: c.quantity }))
                                    }}
                                    tooltipHtml={(x, y0, y) => y.toString()}
                                    tooltipMode='element'
                                    height={300}
                                    margin={{top: 50, left: 50, right: 25, bottom: 25}}
                                    yScale={yScale}
                                    yAxis={{label: '# Violations', innerTickSize: -10000}} />
                            </AutoWidth>
                            <AutoWidth className='violation-account-overview-table'>
                                <SorTable
                                    height={Math.min((violationCount.length + 1) * 50 + 2, 1500)}
                                    filterExprFn={row => `${row.application} ${row.version} ${row.type}`}
                                    rows={violationCount}>
                                    <Table.Column
                                        label='Application'
                                        width={200}
                                        cellRenderer={c => <span onClick={this._selectApp.bind(this, c)} title={c}>{c}</span>}
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
                                        cellRenderer={c => <span title={c}>{c}</span>}
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
                        </div>
                    : null}
                </div>;
    }
}
ViolationOverviewAccount.displayName = 'ViolationOverviewAccount';
ViolationOverviewAccount.propTypes = {
    account: React.PropTypes.string,
    application: React.PropTypes.string,
    violationCount: React.PropTypes.array,
    violationTypes: React.PropTypes.array,
    onConfigurationChange: React.PropTypes.func
};


export default ViolationOverviewAccount;
