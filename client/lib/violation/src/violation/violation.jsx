import React from 'react';
import Icon from 'react-fa';
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
                    <h2>Violations {this.props.loading ? <small><Icon name='circle-o-notch' spin /></small> : null}</h2>
                    <ViolationFilters
                        accounts={this.props.accounts}
                        params={this.props.params} />
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
