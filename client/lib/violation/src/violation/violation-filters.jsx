import React from 'react';
import Icon from 'react-fa';
import FilterDropdown from './filter-dropdown.jsx';
import * as Routes from 'violation/src/routes';
import {stringifySearchParams} from 'violation/src/util';

function range(from, to) {
    var result = [];
    while (from < to) {
        result.push(from);
        from++;
    }
    return result;
}

var accounts = ["0987654321", "123456789"]

class ViolationFilters extends React.Component {
    constructor() {
        super();
    }

    onUpdate(what, data) {
        let params = stringifySearchParams(this.props.params);
        if (what === 'account') {
            params.accounts = data;
        }
        this.context.router.push(Routes.violation(params));
    }

    render() {
        return <table style={{tableLayout: 'fixed', width: '100%'}}>
                <tbody>
                    <tr>
                        <td>
                            <FilterDropdown
                                onUpdate={this.onUpdate.bind(this, 'account')}
                                items={accounts}
                                selection={["0987654321", "123456789"]}
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
