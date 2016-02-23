import React from 'react';
import Icon from 'react-fa';
import ViolationFilters from './violation-filters.jsx';
import ViolationTable from './violation-table.jsx';
import lzw from 'lz-string';
import Clipboard from 'react-copy-to-clipboard';
import * as Routes from 'violation/src/routes';
import {stringifySearchParams} from 'violation/src/util';
import 'common/asset/less/violation/violation.less';

class Violation extends React.Component {
    constructor() {
        super();
    }

    onChangeSort(sort, sortAsc) {
        let newParams = stringifySearchParams(this.props.params);
        newParams.sortBy = sort;
        newParams.sortAsc = sortAsc;
        this.context.router.push(Routes.violation(newParams));
    }

    onSetPage(page) {
        let newParams = stringifySearchParams(this.props.params);
        newParams.page = page;
        this.context.router.push(Routes.violation(newParams));
    }

    handleCopy() {
        this.props.notificationActions.addNotification('Copied URL to clipboard', 'info');
    }

    render() {
        let shortURL = window.location.origin + '/violation/v/' + lzw.compressToEncodedURIComponent(JSON.stringify(this.props.params)),
            shareURL = shortURL.length < window.location.href.length ? shortURL : window.location.href;
        return  <div className='violation'>
                    <h2>Violations {this.props.loading ? <small><Icon name='circle-o-notch' spin /></small> : null}</h2>
                    <Clipboard
                        onCopy={this.handleCopy.bind(this)}
                        text={shareURL}>
                        <div className='btn btn-primary violation-copy-url'>
                            <Icon name='bullhorn' /> Copy sharing URL
                        </div>
                    </Clipboard>
                    <ViolationFilters
                        violationTypes={this.props.violationTypes}
                        accounts={this.props.accounts}
                        params={this.props.params} />
                    <ViolationTable
                        onChangeSort={this.onChangeSort.bind(this)}
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
