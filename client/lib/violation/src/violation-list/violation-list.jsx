import React from 'react';
import Icon from 'react-fa';
import Infinite from 'react-infinite-scroll';
import ViolationOverview from 'violation/src/violation-overview/violation-overview.jsx';
import Violation from 'violation/src/violation-detail/violation-detail.jsx';
import 'promise.prototype.finally';
import 'common/asset/less/violation/violation-list.less';

const InfiniteList = Infinite(React);

class ViolationList extends React.Component {
    constructor(props) {
        super();
        this.stores = {
            fullstop: props.fullstopStore,
            team: props.teamStore,
            user: props.userStore
        };
        this.actions = props.fullstopActions;
        this.state = {
            dispatching: false
        };
    }

    /**
     * Used by infinite list, used to fetch next page of results.
     *
     * @param  {Number} page The page to fetch
     */
    loadMore(page) {
        // we get an error if we don't track this ;_;
        if (!this.state.dispatching) {
            this.setState({
                dispatching: true
            });
            this.actions.updateSearchParams({
                page: page
            });
            this.actions
            .fetchViolations(this.stores.fullstop.getSearchParams())
            .finally(() => {
                this.setState({
                    dispatching: false
                });
            });
        }
    }

    render() {
        let searchParams = this.stores.fullstop.getSearchParams(),
            activeAccountIds = searchParams.accounts,
            violations = this.stores.fullstop.getViolations(activeAccountIds).map(v => v.id),
            pagingInfo = this.stores.fullstop.getPagingInfo(),
            violationCards = violations.map((v, i) => <Violation
                                                        key={v}
                                                        autoFocus={i === 0}
                                                        fullstopStore={this.props.fullstopStore}
                                                        fullstopActions={this.props.fullstopActions}
                                                        userStore={this.props.userStore}
                                                        violationId={v} />);

        return <div className='violationList'>
                    <h2 className='violationList-headline'>Violations</h2>
                    <div className='u-info'>
                        Violations of the STUPS policy and bad practices in accounts you have access to.
                    </div>
                    <ViolationOverview
                        teamStore={this.stores.team}
                        userStore={this.stores.user}
                        fullstopActions={this.actions}
                        fullstopStore={this.stores.fullstop} />
                    <div className='violationList-info'>
                        Fetched {violationCards.length} violations. {pagingInfo.last ? '' : 'Scroll down to load more.'}
                    </div>
                    <h4>Violations</h4>
                    <div
                        data-block='violation-list'
                        className='violationList-list'>
                        <InfiniteList
                            loadMore={this.loadMore.bind(this)}
                            hasMore={!pagingInfo.last}
                            loader={<Icon spin name='circle-o-notch u-spinner' />}>
                            {violationCards}
                        </InfiniteList>
                    </div>
                </div>;
    }
}
ViolationList.displayName = 'ViolationList';
ViolationList.propTypes = {
    fullstopStore: React.PropTypes.object.isRequired,
    teamStore: React.PropTypes.object.isRequired,
    userStore: React.PropTypes.object.isRequired,
    fullstopActions: React.PropTypes.object.isRequired
};
ViolationList.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default ViolationList;
