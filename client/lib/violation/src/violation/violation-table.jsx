import React from 'react';
import Icon from 'react-fa';
import Timestamp from 'react-time';
import Griddle from 'griddle-react';
import Config from 'common/src/config';

function TimestampCell({data}) {
    if (!!data) {
        return <Timestamp
                    format={'YYYY-MM-DD HH:mm'}
                    value={data} />
    }
    return <div>-</div>;
}

function DefaultValueCell({data}) {
    return <div>{!!data ? data : '-'}</div>
}

function BooleanCell({data}) {
    return <Icon name={data ? 'check' : 'times'} />
}

function AccountCell(accounts) {
    return function(props) {
        const acc = accounts[props.data];
        if (acc) {
            return <div>{acc.name}</div>;
        }
        return <div>{props.data}</div>;
    }
}

function TeamCell(accounts) {
    return function(props) {
        const acc = accounts[props.data];
        if (acc) {
            return <div>{acc.owner}</div>;
        }
        return <div>{props.data}</div>;
    }
}

class Pager extends React.Component {
    constructor() {
        super();
    }

    pageChange(page) {
        this.props.setPage(page);
    }

    render() {
        const pages = new Array(this.props.maxPage).fill(1).map((n, i) => i);
        return <div className='violationTable-pager'>
                    <div disabled={this.props.currentPage === 0} onClick={() => this.pageChange(0)}><Icon name='fast-backward' /> First</div>
                    <div onClick={() => this.props.previous()}><Icon name='step-backward' /> {this.props.previousText}</div>
                    <div>Page <select
                                    value={this.props.currentPage}
                                    onChange={(evt) => this.pageChange(evt.target.value)}>
                                    {pages.map(p => <option value={p}>{p + 1}</option>)}
                            </select> / {this.props.maxPage}
                    </div>
                    <div onClick={() => this.props.next()}>{this.props.nextText} <Icon name='step-forward' /></div>
                    <div disabled={this.props.maxPage - 1 === this.props.currentPage} onClick={() => this.pageChange(this.props.maxPage - 1)}>Last <Icon name='fast-forward' /></div>
                </div>
    }
}

class ViolationTable extends React.Component {
    constructor() {
        super();
        this.state = {
            numPages: 100,
            currentPage: 0,
            results: []
        };
    }

    changeSort(sort, sortAsc) {
        this.props.onChangeSort(sort, sortAsc);
    }

    setFilter(filter) {
        // left empty
    }

    setPage(page) {
        this.props.onSetPage(page);
    }

    setPageSize(size) {
        // left empty
    }

    render() {
        var gridColumns = [
                'account_id',
                'owner',
                'created',
                'application_id',
                'version_id',
                'violation_severity',
                'violation_type_id',
                'is_resolved'
            ],
            columnMetadata = [{
                displayName: 'Team',
                columnName: 'account_id',
                customComponent: TeamCell(this.props.accounts)
            }, {
                displayName: 'Account',
                columnName: 'owner',
                customComponent: AccountCell(this.props.accounts)
            } ,{
                displayName: 'Created',
                columnName: 'created',
                customComponent: TimestampCell
            }, {
                displayName: 'Application',
                columnName: 'application_id',
                customComponent: DefaultValueCell
            }, {
                displayName: 'Version',
                columnName: 'version_id',
                customComponent: DefaultValueCell
            }, {
                displayName: 'Criticality',
                columnName: 'violation_severity'
            },{
                displayName: 'Type',
                columnName: 'violation_type_id'
            }, {
                displayName: 'Resolved?',
                columnName: 'is_resolved',
                customComponent: BooleanCell
            }];
        const rowMeta = {
            bodyCssClassName: (row) => this.props.selectedViolation === row.id ?
                                            'standard-row selected' :
                                            'standard-row'
        };
        return <Griddle
                    tableClassName='violationTable'
                    noDataMessage={this.props.loading ? 'Waiting for data…' : 'No violations matching your filters.'}
                    onRowClick={this.props.onRowClick}
                    useGriddleStyles={false}
                    useCustomPagerComponent={true}
                    customPagerComponent={Pager}
                    useExternal={true}
                    externalSetPage={this.setPage.bind(this)}
                    externalSetPageSize={this.setPageSize.bind(this)}
                    externalSetFilter={this.setFilter.bind(this)}
                    externalChangeSort={this.changeSort.bind(this)}
                    externalMaxPage={this.props.pagingInfo.total_pages}
                    externalCurrentPage={this.props.params.page}
                    externalSortColumn={this.props.params.sortBy}
                    externalSortAscending={this.props.params.sortAsc}
                    showFilter={false}
                    columns={gridColumns}
                    columnMetadata={columnMetadata}
                    rowMetadata={rowMeta}
                    results={this.props.violations} />;
    }
}
ViolationTable.displayName = 'ViolationTable';

export default ViolationTable;
