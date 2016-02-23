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
        console.debug(what, data);
        let params = stringifySearchParams(this.props.params);
        if (what === 'account') {
            params.accounts = data;
            this.context.router.push(Routes.violation(params));
        } else if (what === 'date') {
            if (data[1]) {
                params.from = data[0].toISOString();
                params.to = data[1].toISOString();
                this.context.router.push(Routes.violation(params));
            }
        } else if (what === 'type') {
            if (data.length === 0) {
                delete params.type;
            } else {
                params.type = data[0].replace(/\W/gi, "_");
            }
            this.context.router.push(Routes.violation(params));
        }
    }

    render() {
        console.debug(this.props);
        let params = stringifySearchParams(this.props.params);
        return <div className='violation-filters'>
                <table>
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
                            <td></td>
                            <td></td>
                            <td>
                                <FilterDropdown
                                    onUpdate={this.onUpdate.bind(this, 'type')}
                                    singleMode={true}
                                    items={this.props.violationTypes.map(vt => vt.replace(/_/gi, " "))}
                                    selection={[params.type ? params.type.replace(/_/gi, " ") : '']}
                                    title="Filter column" />
                            </td>
                            <td>Resolved?</td>
                        </tr>
                    </tbody>
                </table>
                </div>;
    }
}
ViolationFilters.displayName = 'ViolationFilters';
ViolationFilters.contextTypes = {
    router: React.PropTypes.object
};

export default ViolationFilters;
