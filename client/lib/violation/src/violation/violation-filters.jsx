import React from 'react';
import Icon from 'react-fa';
import DateDropdown from './date-dropdown.jsx';
import FilterDropdown from './filter-dropdown.jsx';
import * as Routes from 'violation/src/routes';
import {stringifySearchParams, values} from 'violation/src/util';

const SHOW_RESOLVED = 'Show resolved',
      SHOW_UNRESOLVED = 'Show unresolved';

class ViolationFilters extends React.Component {
    constructor() {
        super();
    }

    onUpdate(what, data) {
        let params = stringifySearchParams(this.props.params);
        if (what === 'account') {
            // reverse lookup name => id
            const {accounts} = this.props;
            console.debug(accounts)
            const accountIdsByName = Object.keys(accounts)
                                        .map(id => [accounts[id].name, id])
                                        .reduce((m, a) => {m[a[0]] = a[1]; return m;}, {});
            params.accounts = data.map(name => accountIdsByName[name])
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
        } else if (what === 'resolved') {
            if (data.length === 0) {
                params.showResolved = false;
                params.showUnresolved = false;
            } else if (data.length === 1) {
                if (data[0] === SHOW_RESOLVED) {
                    params.showResolved = true;
                    params.showUnresolved = false;
                } else {
                    params.showResolved = false;
                    params.showUnresolved = true;
                }
            } else {
                // must be two
                params.showUnresolved = true;
                params.showResolved = true;
            }
            this.context.router.push(Routes.violation(params));
        }
    }

    render() {
        let params = stringifySearchParams(this.props.params),
            resolvedSelection = [];
        if (params.showResolved) {
            resolvedSelection.push(SHOW_RESOLVED);
        }
        if (params.showUnresolved) {
            resolvedSelection.push(SHOW_UNRESOLVED);
        }

        return <div className='violation-filters'>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <FilterDropdown
                                    onUpdate={this.onUpdate.bind(this, 'account')}
                                    items={values(this.props.accounts).map(a => a.name)}
                                    selection={params.accounts ? params.accounts.map(a => this.props.accounts[a].name) : []}
                                    title='Filter' />
                            </td>
                            <td>
                                <DateDropdown
                                    onUpdate={this.onUpdate.bind(this, 'date')}
                                    range={[this.props.params.from, this.props.params.to]}
                                    title='Filter' />
                            </td>
                            <td></td>
                            <td></td>
                            <td>
                                <FilterDropdown
                                    onUpdate={this.onUpdate.bind(this, 'type')}
                                    singleMode={true}
                                    items={this.props.violationTypes.map(vt => vt.replace(/_/gi, ' '))}
                                    selection={[params.type ? params.type.replace(/_/gi, ' ') : '']}
                                    title='Filter' />
                            </td>
                            <td>
                                <FilterDropdown
                                    onUpdate={this.onUpdate.bind(this, 'resolved')}
                                    items={[SHOW_UNRESOLVED, SHOW_RESOLVED]}
                                    selection={resolvedSelection}
                                    title='Filter' />
                            </td>
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
