import React from 'react';
import Icon from 'react-fa';
import Table from 'fixed-data-table';
import _ from 'lodash';
import 'common/asset/css/fixed-data-table.min.css';

class SortableTable extends React.Component {
    constructor(props) {
        super();
        this.state = {
            rows: props.rows,
            sortBy: '',
            sortAsc: true
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

    sortBy(key) {
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

    renderHeader(label, dataKey) {
        return <div onClick={this.sortBy.bind(this, dataKey)}>{label} <Icon name='sort' /></div>;
    }

    render() {
        return <div>
                    <Table.Table
                        rowHeight={50}
                        rowGetter={idx => this.state.rows[idx]}
                        rowsCount={this.state.rows.length}
                        height={300}
                        width={this.props.width || 500}
                        headerHeight={50}>
                        {this.props.children.map(c => {
                            c.props.headerRenderer = this.renderHeader.bind(this);
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