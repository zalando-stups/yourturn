import React from 'react';
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

    sortBy(key) {
        this.setState({
            rows: _.sortBy(this.state.rows, key)
        });
    }

    renderHeader(label, dataKey) {
        return <span onClick={this.sortBy.bind(this, dataKey)}>{label}</span>;
    }

    render() {
        return <Table.Table
                    rowHeight={50}
                    rowGetter={idx => this.state.rows[idx]}
                    rowsCount={this.state.rows.length}
                    height={500}
                    width={500}
                    headerHeight={50}>
                    {this.props.children.map(c => {
                        c.props.headerRenderer = this.renderHeader.bind(this);
                        return c;
                    })}
                </Table.Table>
    }
}

export default SortableTable;