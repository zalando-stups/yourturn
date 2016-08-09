import React from 'react';
import Icon from 'react-fa';
import ViolationFilters from './violation-filters.jsx';
import ViolationTable from './violation-table.jsx';
import ViolationCard from 'violation/src/violation-card/violation-card.jsx';
import lzw from 'lz-string';
import Clipboard from 'react-copy-to-clipboard';
import * as Routes from 'violation/src/routes';
import {stringifySearchParams} from 'violation/src/util';
import 'common/asset/less/violation/violation.less';

class Violation extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedViolation: null
        };
    }

    onChangeSort(sort, sortAsc) {
        let newParams = stringifySearchParams(this.props.params);
        newParams.sortBy = sort;
        newParams.sortAsc = sortAsc;
        this.context.router.push(Routes.violation(newParams));
    }

    onSetPageSize(size) {
        let newParams = stringifySearchParams(this.props.params);
        newParams.size = size;
        this.context.router.push(Routes.violation(newParams));
    }

    onSetPage(page) {
        let newParams = stringifySearchParams(this.props.params);
        newParams.page = page;
        this.context.router.push(Routes.violation(newParams));
    }

    onSelectViolation({props, getDOMNode}) {
        const bbox = getDOMNode().getBoundingClientRect();
        this.setState({
            selectedViolation: props.data.id,
            selectedViolationTop: window.scrollY + bbox.top + bbox.height
        });
    }

    onResolveViolation(violation, message) {
        this.props.fullstopActions.resolveViolation(violation.id, message);
    }

    handleCopy() {
        this.props.notificationActions.addNotification('Copied URL to clipboard', 'info');
    }

    closeCard() {
        this.setState({
            selectedViolation: null
        });
    }

    render() {
        let shortURL = window.location.origin + '/violation/v/' + lzw.compressToEncodedURIComponent(JSON.stringify(this.props.params)),
            shareURL = shortURL.length < window.location.href.length ? shortURL : window.location.href,
            selectedViolation = this.state.selectedViolation ?
                                    this.props.fullstopStore.getViolation(this.state.selectedViolation) :
                                    null;
        return  <div className='violation'>
                    <h2>Violations {this.props.loading ? <small><Icon name='circle-o-notch' spin /></small> : null}</h2>
                    <Clipboard
                        onCopy={this.handleCopy.bind(this)}
                        text={shareURL}>
                        <div className='btn btn-primary violation-copy-url'>
                            <Icon name='bullhorn' /> Copy sharing URL
                        </div>
                    </Clipboard>
                    <div className='u-warning' style={{display: this.props.error ? 'block' : 'none'}}>
                        {this.props.error && this.props.error.message || 'Error'}
                    </div>
                    <div className='container'>
                        <ViolationFilters
                            violationTypes={this.props.violationTypes}
                            accounts={this.props.accounts}
                            onUpdate={this.closeCard.bind(this)}
                            params={this.props.params} />
                        <ViolationTable
                            onRowClick={this.onSelectViolation.bind(this)}
                            onChangeSort={this.onChangeSort.bind(this)}
                            onSetPage={this.onSetPage.bind(this)}
                            onSetPageSize={this.onSetPageSize.bind(this)}
                            violations={this.props.violations}
                            accounts={this.props.accounts}
                            pagingInfo={this.props.pagingInfo}
                            params={this.props.params} />
                    </div>
                    <div style={{
                        display: !!this.state.selectedViolation ? 'block' : 'none',
                        position: 'absolute',
                        top: !!this.state.selectedViolation ? this.state.selectedViolationTop : 0
                    }}>
                        {!!this.state.selectedViolation ?
                            <ViolationCard
                                closable={true}
                                editable={this.props.accounts[selectedViolation.account_id].userAccess}
                                style={{
                                    maxWidth: 600,
                                    fontSize: '.66em',
                                    lineHeight: '1.75em'
                                }}
                                accounts={this.props.accounts}
                                autoFocus={true}
                                onClickOutside={this.closeCard.bind(this)}
                                onClose={this.closeCard.bind(this)}
                                onResolve={this.onResolveViolation.bind(this)}
                                violation={selectedViolation} />
                        :
                        null}
                    </div>
                </div>;
    }
}

Violation.displayName = 'Violation';

Violation.contextTypes = {
    router: React.PropTypes.object
};

// TODO make propTypes more specific
Violation.propTypes = {
    accounts: React.PropTypes.object,
    error: React.PropTypes.object,
    fullstopActions: React.PropTypes.shape({
        resolveViolation: React.PropTypes.func
    }).isRequired,
    fullstopStore: React.PropTypes.shape({
        getViolation: React.PropTypes.func
    }).isRequired,
    loading: React.PropTypes.bool,
    notificationActions: React.PropTypes.shape({
        addNotification: React.PropTypes.func
    }).isRequired,
    pagingInfo: React.PropTypes.shape({
        last: React.PropTypes.bool,
        page: React.PropTypes.number,
        total: React.PropTypes.number,
        total_pages: React.PropTypes.number
    }).isRequired,
    params: React.PropTypes.object,
    violationTypes: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    violations : React.PropTypes.arrayOf(React.PropTypes.shape({
        comment: React.PropTypes.string,
        id: React.PropTypes.number,
        account_id: React.PropTypes.string,
        region: React.PropTypes.string,
        instance_id: React.PropTypes.string,
        username: React.PropTypes.string,
        message: React.PropTypes.string,
        rule_id: React.PropTypes.string,
        meta_info: React.PropTypes.oneOfType(React.PropTypes.string, React.PropTypes.object),
        is_whitelisted: React.PropTypes.bool,
        violation_type: React.PropTypes.shape({
            priority: React.PropTypes.number
        }),
        last_modified_by: React.PropTypes.string,
        timestamp: React.PropTypes.number,
        last_modified: React.PropTypes.string
    })).isRequired
};

export default Violation;
