import React from 'react';
import Icon from 'react-fa';
import Table from 'fixed-data-table';
import _ from 'lodash';
import fuzzysearch from 'fuzzysearch';
import 'common/asset/css/fixed-data-table.min.css';

class SortableTable extends React.Component {
    constructor(props) {
        super();
        this.state = {
            rows: props.rows,
            sortBy: '',
            sortAsc: true,
            filter: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        let rows = nextProps.rows;
        if (this.state.sortBy) {
            rows = _.sortBy(rows, this.state.sortBy);
        }
        if (!this.state.sortAsc) {
            rows = rows.reverse();
        }
        this.setState({
            rows: rows
        });
    }

    _sortBy(key) {
        if (this.state.sortBy === key) {
            this.setState({
                rows: this.state.sortAsc ?
                        _.sortBy(this.state.rows, key).reverse() :
                        _.sortBy(this.state.rows, key),
                sortBy: key,
                sortAsc: !this.state.sortAsc
            });
        } else {
            this.setState({
                rows: _.sortBy(this.state.rows, key),
                sortBy: key,
                sortAsc: true
            });
        }
    }

    _renderHeader(label, dataKey) {
        return <div onClick={this._sortBy.bind(this, dataKey)}>{label} <Icon name='sort' /></div>;
    }

    _filter(evt) {
        this.setState({
            filter: evt.target.value
        });
    }

    render() {
        let displayedRows = this.state.filter ?
                                this.state.rows.filter(r => fuzzysearch(this.state.filter, this.props.filterExprFn(r))) :
                                this.state.rows;
        return <div>
                    <small>You can search for accounts or violation types.</small>
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
                        {this.props.children.map(c => {
                            c.props.headerRenderer = this._renderHeader.bind(this);
                            return c;
                        })}
                    </Table.Table>
                </div>;
    }
}
SortableTable.displayName = 'SortableTable';
SortableTable.propTypes = {
    width: React.PropTypes.number,
    children: React.PropTypes.oneOf([React.PropTypes.array, React.PropTypes.object])
};
export default SortableTable;