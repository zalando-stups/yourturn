import React from 'react';
import Icon from 'react-fa';
import Table from 'fixed-data-table';
import _ from 'lodash';
import fuzzysearch from 'fuzzysearch';
import 'common/asset/css/fixed-data-table.min.css';

const ASC = 'asc',
    DESC = 'desc';

class SortableTable extends React.Component {
    constructor(props) {
        super();
        this.state = {
            rows: props.rows,
            sortBy: [],
            sortOrder: [],
            filter: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        let rows = nextProps.rows;
        if (this.state.sortBy.length) {
            rows = _.sortBy(rows, this.state.sortBy[0]);
        }
        if (!this.state.sortBy[0] === ASC) {
            rows = rows.reverse();
        }
        this.setState({
            rows: rows
        });
    }

    _sortBy(key) {
        if (!this.state.sortBy.length) {
            // sort by key desc by default
            console.log('first sort', [key], [DESC], _.sortByOrder(this.state.rows, [key], [DESC]));
            this.setState({
                rows: _.sortByOrder(this.state.rows, [key], [DESC]),
                sortBy: [key],
                sortOrder: [DESC]
            });
        } else {
            // so this was sorted before
            // check if key is the same
            if (this.state.sortBy[0] == key) {
                // it is, so just flip order
                // HAHA!
                let newOrder = [ this.state.sortOrder[0] === ASC ? DESC : ASC ].concat(this.state.sortOrder.splice(1));
                console.log('flip order', this.state.sortBy, newOrder);
                this.setState({
                    sortOrder: newOrder,
                    rows: _.sortByOrder(this.state.rows, this.state.sortBy, newOrder)
                });
            } else {
                let newBy = [key].concat(this.state.sortBy.length ? [this.state.sortBy[0]] : []),
                    newOrder = [DESC].concat(this.state.sortOrder.length ? [this.state.sortOrder[0]] : []);
                console.log('sort with different key', newBy, newOrder);
                this.setState({
                    sortOrder: newOrder,
                    sortBy: newBy,
                    rows: _.sortByOrder(this.state.rows, newBy, newOrder)
                });
            }
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
    filterExprFn: React.PropTypes.func,
    children: React.PropTypes.oneOf([React.PropTypes.array, React.PropTypes.object])
};
export default SortableTable;