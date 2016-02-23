import React from 'react';
import Icon from 'react-fa';
import Timestamp from 'react-time';
import Griddle from 'griddle-react';
import Config from 'common/src/config';

class TimestampCell extends React.Component {
    constructor() {
        super();
    }
    render() {
        if (!!this.props.data) {
            return <Timestamp
                        format={'YYYY-MM-DD@HH:mm'}
                        value={this.props.data} />
        }
        return <div>-</div>;
    }
}

class DefaultValueCell extends React.Component {
    constructor() {
        super();
    }

    render() {
        if (!!this.props.data) {
            return <div>{this.props.data}</div>
        }
        return <div>-</div>;
    }
}

class BooleanCell extends React.Component {
    constructor() {
        super();
    }

    render() {
        if (this.props.data) {
            return <Icon name='check' />;
        }
        return <Icon name='times' />;
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

        return <div className='violationTable-pager'>
                    <div onClick={() => this.props.previous()}>{this.props.previousText}</div>
                    <div>Page {this.props.currentPage + 1}/{this.props.maxPage}</div>
                    <div onClick={() => this.props.next()}>{this.props.nextText}</div>
                </div>
    }
}

var gridColumns = [
        'account_id',
        'created',
        'application_id',
        'version_id',
        'violation_type_id',
        'is_resolved'
    ],
    columnMetadata = [{
        displayName: 'Account',
        columnName: 'account_id'
    }, {
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
        displayName: 'Type',
        columnName: 'violation_type_id'
    }, {
        displayName: 'Resolved?',
        columnName: 'is_resolved',
        customComponent: BooleanCell
    }];

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
        return <Griddle
                    tableClassName='violationTable'
                    noDataMessage='Waiting for data…'
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
                    results={this.props.violations} />;
    }
}
ViolationTable.displayName = 'ViolationTable';

export default ViolationTable;
