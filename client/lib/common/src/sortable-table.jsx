import React from 'react';
import cloneWithProps from 'react-addons-clone-with-props';
import Icon from 'react-fa';
import Table from 'fixed-data-table';
import _ from 'lodash';
import 'common/asset/css/fixed-data-table.min.css';
import 'common/asset/less/common/sortable-table.less';

const ASC = 'asc',
    DESC = 'desc';

class SortableTable extends React.Component {
    constructor(props) {
        super();
        this.state = {
            rows: props.rows,
            sortBy: props.sortBy || '',
            sortOrder: props.sortOrder || '',
            filter: props.filter || ''
        };
    }

    componentWillReceiveProps(nextProps) {
        let {rows, sortBy, sortOrder} = nextProps;
        sortBy = sortBy || this.state.sortBy;
        sortOrder = sortOrder || this.state.sortOrder;
        if (sortBy.length) {
            rows = _.sortBy(rows, sortBy);
        }
        if (sortOrder && sortOrder !== ASC) {
            rows = rows.reverse();
        }
        this.setState({
            rows,
            sortBy,
            sortOrder
        });
    }

    _sortBy(key) {
        let state;
        if (!this.state.sortBy) {
            // sort by key desc by default
            state = {
                sortBy: key,
                sortOrder: DESC
            };
        } else {
            // so this was sorted before
            // check if key is the same
            if (this.state.sortBy === key) {
                // it is, so just flip order
                // HAHA!
                let newOrder = this.state.sortOrder === ASC ? DESC : ASC;
                state = {
                    sortOrder: newOrder,
                    sortBy: key
                };
            } else {
                state = {
                    sortBy: key,
                    sortOrder: DESC
                };
            }
        }
        this.setState(state);
        if (typeof this.props.onSortChange === 'function') {
            this.props.onSortChange(state);
        }
    }

    _renderHeader(label, dataKey) {
        let sortedByMe = this.state.sortBy === dataKey;
        return <div
                    className={sortedByMe ? 'sortable-table-primary-sort-key' : null}
                    onClick={this._sortBy.bind(this, dataKey)}>
                    {label} {sortedByMe ?
                                (this.state.sortOrder === ASC ? <Icon name='sort-asc' /> : <Icon name='sort-desc' />) :
                                <Icon name='sort' />}
                </div>;
    }

    _filter(evt) {
        this.setState({
            filter: evt.target.value ? evt.target.value.toLowerCase() : ''
        });
    }

    render() {
        let displayedRows = this.state.filter ?
                                this.state.rows.filter(r => this.props.filterExprFn(r).indexOf(this.state.filter) >= 0) :
                                this.state.rows;

        displayedRows = _.sortByOrder(displayedRows, this.state.sortBy, this.state.sortOrder);
        return <div className='sortable-table'>
                    <small>{this.props.helpText}</small>
                    <div className='input-group'>
                        <Icon name='search' />
                        <input
                            onChange={this._filter.bind(this)}
                            placeholder='stups'
                            type='search' />
                    </div>
                    <Table.Table
                        rowHeight={50}
                        headerHeight={50}
                        rowGetter={idx => displayedRows[idx]}
                        rowsCount={displayedRows.length}
                        width={this.props.width || 500}
                        {...this.props}>
                        {React.Children.map(this.props.children, c => React.cloneElement(c, { headerRenderer: this._renderHeader.bind(this)}))}
                    </Table.Table>
                </div>;
    }
}
SortableTable.displayName = 'SortableTable';
SortableTable.propTypes = {
    width: React.PropTypes.number,
    filterExprFn: React.PropTypes.func,
    helpText: React.PropTypes.string
};
export default SortableTable;