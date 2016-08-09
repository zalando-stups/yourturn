import React from 'react';
import {Route, IndexRoute} from 'react-router';
import Icon from 'react-fa';
import lzw from 'lz-string';

import Violation from './violation/violation.jsx';
import ViolationDetail from './violation-detail/violation-detail.jsx';
import {parseSearchParams} from 'violation/src/util';

import REDUX from 'yourturn/src/redux';
import {
    bindGettersToState,
    bindActionsToStore
} from 'common/src/util';
import {wrapEnter, requireAccounts} from 'common/src/router-utils';
import {connect} from 'react-redux';

import * as UserGetter from 'common/src/data/user/user-getter';
import * as TeamGetter from 'common/src/data/team/team-getter';
import * as FullstopGetter from 'common/src/data/fullstop/fullstop-getter';

import * as NotificationActions from 'common/src/data/notification/notification-actions';
import * as UserActions from 'common/src/data/user/user-actions';
import * as TeamActions from 'common/src/data/team/team-actions';
import * as FullstopActions from 'common/src/data/fullstop/fullstop-actions';

const FULLSTOP_ACTIONS = bindActionsToStore(REDUX, FullstopActions),
      USER_ACTIONS = bindActionsToStore(REDUX, UserActions),
      NOTIFICATION_ACTIONS = bindActionsToStore(REDUX, NotificationActions),
      TEAM_ACTIONS = bindActionsToStore(REDUX, TeamActions);

function ensureDefaultSearchParams(router, props, forceAddAccounts=false) {
    let {location, fullstopStore, userStore} = props,
        defaultParams = fullstopStore.getDefaultSearchParams(),
        defaultAccounts = userStore.getUserCloudAccounts(),
        queryParams = Object.assign({}, location.query);

    if ((!queryParams.accounts && forceAddAccounts) ||
        !queryParams.showUnresolved ||
        !queryParams.showResolved ||
        !queryParams.sortAsc ||
        !queryParams.sortBy ||
        !queryParams.size ||
        !queryParams.page) {

        // ensure default params are in url
        if (!queryParams.accounts) {
            queryParams.accounts = [];
            // this might or might not have an effect since transition hook is fired before fetchData
            Array.prototype.push.apply(queryParams.accounts, defaultAccounts.map(a => a.id));
        }
        if (!queryParams.showUnresolved && !queryParams.showResolved) {
            // query might not be empty (this is only the case when accessing via menubar)
            // but still have parameters missing
            // so we add the default ones
            queryParams.showUnresolved = defaultParams.showUnresolved;
            queryParams.showResolved = defaultParams.showResolved;
        }
        if (!queryParams.sortAsc) {
            queryParams.sortAsc = defaultParams.sortAsc;
        }
        if (!queryParams.sortBy) {
            queryParams.sortBy = defaultParams.sortBy;
        }
        if (!queryParams.sortBy) {
            queryParams.sortBy = defaultParams.sortBy;
        }
        if (!queryParams.from) {
            queryParams.from = defaultParams.from;
        }
        if (!queryParams.to) {
            queryParams.to = defaultParams.to;
        }
        if (!queryParams.page) {
            queryParams.page = defaultParams.page;
        }
        if (!queryParams.size) {
            queryParams.size = defaultParams.size;
        }
        router.replace({
            pathname: '/violation',
            query: queryParams
        });
    }
}

class ViolationHandler extends React.Component {
    constructor() {
        super();
    }

    componentWillMount() {
        ensureDefaultSearchParams(this.context.router, this.props, true);
        FULLSTOP_ACTIONS.fetchViolations(parseSearchParams(this.props.routing.location.search));
    }

    componentWillReceiveProps(nextProps) {
        ensureDefaultSearchParams(this.context.router, nextProps);
        if (nextProps.location.search !== this.props.location.search) {
            FULLSTOP_ACTIONS.fetchViolations(parseSearchParams(nextProps.location.search));
        }
    }

    render() {
        let violations = this.props.fullstopStore.getViolations(),
            userAccs = this.props.userStore.getUserCloudAccounts(),
            // index accounts by id and set access flag
            accounts = this.props.teamStore.getAccounts().reduce((m, a) => {
                a.userAccess = userAccs.filter(ua => ua.id === a.id).length > 0;
                m[a.id] = a;
                return m; },
            {}),
            violationTypes = Object.keys(this.props.fullstopStore.getViolationTypes()),
            violationLoading = this.props.fullstopStore.getLoading(),
            violationError = this.props.fullstopStore.getError(),
            pagingInfo = this.props.fullstopStore.getPagingInfo();
        return <Violation
                    notificationActions={NOTIFICATION_ACTIONS}
                    fullstopActions={FULLSTOP_ACTIONS}
                    fullstopStore={this.props.fullstopStore}
                    violations={violations}
                    violationTypes={violationTypes}
                    loading={violationLoading}
                    error={violationError}
                    accounts={accounts}
                    pagingInfo={pagingInfo}
                    params={parseSearchParams(this.props.location.search)}
                    routing={this.props.routing} />;
    }
}
ViolationHandler.fetchData = function(routerState, state) {
    let promises = [],
        accountsPromise = TeamGetter.getAccounts(state.team).length === 0 ?
                            TEAM_ACTIONS.fetchAccounts() :
                            Promise.resolve(TeamGetter.getAccounts(state.team));

    promises.push(accountsPromise);
    if (!Object.keys(FullstopGetter.getViolationTypes(state.fullstop)).length) {
        promises.push(FULLSTOP_ACTIONS.fetchViolationTypes());
    }

    promises.push(requireAccounts(state, USER_ACTIONS));
    return Promise.all(promises);
};
ViolationHandler.displayName = 'ViolationHandler';
ViolationHandler.propTypes = {
    fullstopStore: React.PropTypes.shape({
        getError: React.PropTypes.func,
        getLoading: React.PropTypes.func,
        getPagingInfo: React.PropTypes.func,
        getViolationTypes: React.PropTypes.func,
        getViolations: React.PropTypes.func
    }).isRequired,
    location: React.PropTypes.shape({
        search: React.PropTypes.any // TODO change
    }),
    routing: React.PropTypes.shape({
        location: React.PropTypes.shape({
            search: React.PropTypes.any // TODO change
        })
    }).isRequired,
    teamStore: React.PropTypes.shape({
        getAccounts: React.PropTypes.func
    }).isRequired,
    userStore: React.PropTypes.shape({
        getUserCloudAccounts: React.PropTypes.func
    }).isRequired
};
ViolationHandler.contextTypes = {
    router: React.PropTypes.object,
    routing: React.PropTypes.object,
    location: React.PropTypes.object,
    userStore: React.PropTypes.object,
    fullstopStore: React.PropTypes.object,
    teamStore: React.PropTypes.object
};
let ConnectedViolationHandler = connect(state => ({
    routing: state.routing,
    userStore: bindGettersToState(state.user, UserGetter),
    fullstopStore: bindGettersToState(state.fullstop, FullstopGetter),
    teamStore: bindGettersToState(state.team, TeamGetter)
}))(ViolationHandler);

const ViolationDetailHandler = (props) => {
    const accounts = props.teamStore.getAccounts().reduce((m, a) => {m[a.id] = a; return m; }, {});
    return <ViolationDetail
                violationId={parseInt(props.params.violationId, 10)}
                accounts={accounts}
                fullstopActions={FULLSTOP_ACTIONS}
                {...props} />;
};
ViolationDetailHandler.fetchData = function (routerState, state) {
    FULLSTOP_ACTIONS.fetchViolation(routerState.params.violationId);
    TEAM_ACTIONS.fetchAccounts();
    return requireAccounts(state, USER_ACTIONS);
};
ViolationDetailHandler.displayName = 'ViolationDetailHandler';
ViolationDetailHandler.propTypes = {
    params: React.PropTypes.object.isRequired,
    teamStore: React.PropTypes.shape({
        getAccounts: React.PropTypes.func
    }).isRequired
};
let ConnectedViolationDetailHandler = connect(state => ({
    userStore: bindGettersToState(state.user, UserGetter),
    teamStore: bindGettersToState(state.team, TeamGetter),
    fullstopStore: bindGettersToState(state.fullstop, FullstopGetter)
}))(ViolationDetailHandler);


class ViolationShortUrlHandler extends React.Component {
    constructor(props, context) {
        super();
        context.router.replace({
            pathname: 'violation',
            query: JSON.parse(lzw.decompressFromEncodedURIComponent(props.params.shortened))
        })
    }

    render() {
        return <div><Icon name='circle-o-notch' spin /> Redirecting...</div>;
    }
}
ViolationShortUrlHandler.displayName = 'ViolationShortUrlHandler';
ViolationShortUrlHandler.propTypes = {
    params: React.PropTypes.object.isRequired
};
ViolationShortUrlHandler.contextTypes = {
    router: React.PropTypes.object.isRequired
};

const ROUTES =
    <Route path='violation'>
        <IndexRoute
            onEnter={wrapEnter(ViolationHandler.fetchData)}
            component={ConnectedViolationHandler} />
        <Route
            path='v/:shortened'
            component={ViolationShortUrlHandler} />
        <Route
            path=':violationId'
            onEnter={wrapEnter(ViolationDetailHandler.fetchData)}
            component={ConnectedViolationDetailHandler} />
    </Route>;

export default ROUTES;
