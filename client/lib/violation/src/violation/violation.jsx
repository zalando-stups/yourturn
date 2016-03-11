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

    onSetPage(page) {
        let newParams = stringifySearchParams(this.props.params);
        newParams.page = page;
        this.context.router.push(Routes.violation(newParams));
    }

    onSelectViolation({props, getDOMNode}) {
        const bbox = getDOMNode().getBoundingClientRect();
        this.setState({
            selectedViolation: props.data.id === this.state.selectedViolation ? null : props.data.id,
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
                            selectedViolation={this.state.selectedViolation}
                            {...this.props} />
                    </div>
                    <div style={{
                        display: !!this.state.selectedViolation ? 'block' : 'none',
                        position: 'absolute',
                        top: !!this.state.selectedViolation ? this.state.selectedViolationTop : 0
                    }}>
                        {!!this.state.selectedViolation ?
                            <ViolationCard
                                editable={this.props.accounts[selectedViolation.account_id].userAccess}
                                style={{maxWidth: 600, fontSize: '.66em', lineHeight: '1.75em'}}
                                accounts={this.props.accounts}
                                autoFocus={true}
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

export default Violation;
