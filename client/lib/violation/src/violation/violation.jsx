import React from 'react';
import ViolationFilters from './violation-filters.jsx';
import ViolationTable from './violation-table.jsx';
import * as Routes from 'violation/src/routes';
import {stringifySearchParams} from 'violation/src/util';

class Violation extends React.Component {
    constructor() {
        super();
    }

    onSetPage(page) {
        let newParams = stringifySearchParams(this.props.params);
        newParams.page = page;
        this.context.router.push(Routes.violation(newParams));
    }

    render() {
        return  <div>
                    <h2>Violations</h2>
                    <ViolationFilters />
                    <ViolationTable
                        onSetPage={this.onSetPage.bind(this)}
                        {...this.props} />
                </div>;
    }
}
Violation.displayName = 'Violation';
Violation.contextTypes = {
    router: React.PropTypes.object
};

export default Violation;
