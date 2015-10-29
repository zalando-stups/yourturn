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
        this.stores = {
            fullstop: props.fullstopStore
        };
        this.state = {
        };
    }

    render() {
        let searchParams = this.stores.fullstop.getSearchParams(),
            violationCount = this.stores.fullstop
                                .getViolationCountIn(searchParams.accounts.length === 1 ?
                                                        searchParams.accounts[0] :
                                                        searchParams.inspectedAccount)
                                .map(v => ({
                                    application: v.application || '',
                                    version: v.version || '',
                                    quantity: v.quantity,
                                    type: v.type
                                })),
            maxQuantity = violationCount.reduce((prev, cur) => prev > cur.quantity ? prev : cur.quantity, 0),
            yScale = d3.scale.linear().domain([0, maxQuantity]).range([225, 0]).nice();
        return <div className='violation-account-overview'>
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
                        <AutoWidth>
                            <SorTable
                                height={Math.min((violationCount.length + 1) * 50 + 2, 1500)}
                                filterExprFn={row => `${row.application} ${row.version} ${row.type}`}
                                rows={violationCount}>
                                <Table.Column
                                    label='Violation Type'
                                    width={200}
                                    flexGrow={3}
                                    dataKey='type' />
                                <Table.Column
                                    label='Application'
                                    width={200}
                                    dataKey='application' />
                                <Table.Column
                                    label='Version'
                                    width={200}
                                    dataKey='version' />
                                <Table.Column
                                    label='Count'
                                    width={100}
                                    flexGrow={1}
                                    cellRenderer={c => <span className='sortable-table-align-right'>{c}</span>}
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
    fullstopStore: React.PropTypes.object.isRequired
};

export default ViolationOverviewAccount;
