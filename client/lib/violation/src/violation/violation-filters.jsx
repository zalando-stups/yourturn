import React from 'react';
import Icon from 'react-fa';
import FilterDropdown from './filter-dropdown.jsx';

function range(from, to) {
    var result = [];
    while (from < to) {
        result.push(from);
        from++;
    }
    return result;
}

var accounts = range(0, 120)
                .map(s => parseInt(Math.random() * Math.pow(10, 12), 10))
                .map(i => Number(i).toString());

class ViolationFilters extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <table style={{tableLayout: 'fixed', width: '100%'}}>
                <tbody>
                    <tr>
                        <td>
                            <FilterDropdown
                                items={accounts}
                                title="Account" />
                        </td>
                        <td>Created</td>
                        <td>Application</td>
                        <td>Version</td>
                        <td>User</td>
                        <td>Type</td>
                        <td>Resolved?</td>
                    </tr>
                </tbody>
                </table>;
    }
}
ViolationFilters.displayName = 'ViolationFilters';
ViolationFilters.contextTypes = {
    router: React.PropTypes.object
};

export default ViolationFilters;
