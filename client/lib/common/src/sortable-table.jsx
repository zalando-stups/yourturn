import React from 'react';
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
            this.setState({
                sortBy: [key],
                sortOrder: [DESC]
            });
        } else {
            // so this was sorted before
            // check if key is the same
            if (this.state.sortBy[0] === key) {
                // it is, so just flip order
                // HAHA!
                let newOrder = [ this.state.sortOrder[0] === ASC ? DESC : ASC ].concat(this.state.sortOrder.splice(1));
                this.setState({
                    sortOrder: newOrder
                });
            } else {
                let newBy = [key].concat(this.state.sortBy.length ? [this.state.sortBy[0]] : []),
                    newOrder = [DESC].concat(this.state.sortOrder.length ? [this.state.sortOrder[0]] : []);
                this.setState({
                    sortOrder: newOrder,
                    sortBy: newBy
                });
            }
        }
    }

    _renderHeader(label, dataKey) {
        let sortedByMe = this.state.sortBy.indexOf(dataKey);
        return <div
                    className={sortedByMe === 0 ? 'sortable-table-primary-sort-key' : null}
                    onClick={this._sortBy.bind(this, dataKey)}>
                    {label} {sortedByMe >= 0 ?
                                (this.state.sortOrder[sortedByMe] === ASC ? <Icon name='sort-asc' /> : <Icon name='sort-desc' />) :
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