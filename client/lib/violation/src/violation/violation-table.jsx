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
            // return <span>Yes</span>;
        }
        // return <span>No</span>;
        return <Icon name='times' />;
    }
}

var gridColumns = [
        'account_id',
        'created',
        'application_id',
        'version_id',
        'username',
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
        displayName: 'User',
        columnName: 'username',
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
            results: [],
            pageSize: 10,
            sortColumn: null,
            sortAsc: true
        };
    }

    changeSort(sort, sortAsc) {
        console.debug('changeSort', arguments);
    }

    setFilter(filter) {
        console.debug('setFilter', arguments);
    }

    setPage(page) {
        this.props.onSetPage(page);
    }

    setPageSize(size) {
        console.debug('setPageSize', arguments);
    }

    render() {
        return <Griddle
                    noDataMessage='Fuck off, punk'
                    useExternal={true}
                    externalSetPage={this.setPage.bind(this)}
                    externalSetPageSize={this.setPageSize.bind(this)}
                    externalSetFilter={this.setFilter.bind(this)}
                    externalChangeSort={this.changeSort.bind(this)}
                    externalMaxPage={this.props.pagingInfo.total_pages}
                    externalCurrentPage={this.props.params.page}
                    externalSortColumn={this.state.sortColumn}
                    externalSortAscending={this.state.sortAsc}
                    showFilter={false}
                    columns={gridColumns}
                    columnMetadata={columnMetadata}
                    results={this.props.violations} />;
    }
}
ViolationTable.displayName = 'ViolationTable';

export default ViolationTable;
