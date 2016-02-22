import React from 'react';
import Icon from 'react-fa';
import DateDropdown from './date-dropdown.jsx';
import FilterDropdown from './filter-dropdown.jsx';
import * as Routes from 'violation/src/routes';
import {stringifySearchParams} from 'violation/src/util';

class ViolationFilters extends React.Component {
    constructor() {
        super();
    }

    onUpdate(what, data) {
        let params = stringifySearchParams(this.props.params);
        if (what === 'account') {
            params.accounts = data;
        } else if (what === 'date') {
            params.from = data[0].toISOString();
            if (data[1]) {
                params.to = data[1].toISOString();
            }
        }
        this.context.router.push(Routes.violation(params));
    }

    render() {
        let params = stringifySearchParams(this.props.params);
        return <table style={{tableLayout: 'fixed', width: '100%'}}>
                <tbody>
                    <tr>
                        <td>
                            <FilterDropdown
                                onUpdate={this.onUpdate.bind(this, 'account')}
                                items={this.props.accounts.map(a => a.id)}
                                selection={params.accounts}
                                title="Filter column" />
                        </td>
                        <td>
                            <DateDropdown
                                onUpdate={this.onUpdate.bind(this, 'date')}
                                range={[this.props.params.from, this.props.params.to]}
                                title="Filter column" />
                        </td>
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
