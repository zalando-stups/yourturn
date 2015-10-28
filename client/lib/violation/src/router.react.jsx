import React from 'react';
import {Route, DefaultRoute} from 'react-router';
import FlummoxComponent from 'flummox/component';
import FLUX from 'yourturn/src/flux';
import ViolationList from './violation-list/violation-list.jsx';
import ViolationDetail from './violation-detail/violation-detail.jsx';
import {requireAccounts} from 'common/src/util';
import moment from 'moment';
import Icon from 'react-fa';
import lzw from 'lz-string';
import _ from 'lodash';

const FULLSTOP_ACTIONS = FLUX.getActions('fullstop'),
      FULLSTOP_STORE = FLUX.getStore('fullstop'),
      USER_STORE = FLUX.getStore('user'),
      NOTIFICATION_ACTIONS = FLUX.getActions('notification'),
      TEAM_ACTIONS = FLUX.getActions('team'),
      TEAM_STORE = FLUX.getStore('team');

function parseQueryParams(params) {
    let result = {};
    if (params.accounts) {
        result.accounts = params.accounts;
    }
    if (params.from) {
        result.from = moment(params.from);
    }
    if (params.to) {
        result.to = moment(params.to);
    }
    if (params.inspectedAccount) {
        result.inspectedAccount = params.inspectedAccount;
    }
    if (params.activeTab) {
        result.activeTab = parseInt(params.activeTab, 10);
    }
    return result;
}

class ViolationListHandler extends React.Component {
    constructor() {
        super();
    }
    render() {
        return <FlummoxComponent
                    flux={FLUX}
                    connectToStores={['fullstop', 'team']}>
                    <ViolationList
                        notificationActions={NOTIFICATION_ACTIONS}
                        userStore={USER_STORE}
                        fullstopActions={FULLSTOP_ACTIONS}
                        fullstopStore={FULLSTOP_STORE}
                        teamStore={TEAM_STORE} />
                </FlummoxComponent>;
    }
}
ViolationListHandler.displayName = 'ViolationListHandler';
ViolationListHandler.fetchData = function(router) {
    let promises = [];
    // if there are query params we have to pre-set those as search parameters
    if (!_.isEmpty(router.query)) {
        FULLSTOP_ACTIONS.updateSearchParams(parseQueryParams(router.query));
        let searchParams = FULLSTOP_STORE.getSearchParams();
        FULLSTOP_ACTIONS.fetchViolations(searchParams);
        FULLSTOP_ACTIONS.fetchViolationCount(searchParams);
    }
    if (!FULLSTOP_STORE.getViolationTypes().length) {
        promises.push(FULLSTOP_ACTIONS.fetchViolationTypes());
    }
    // if there aren't any teams from team service yet, fetch them NAO
    if (!TEAM_STORE.getAccounts().length) {
        TEAM_ACTIONS.fetchAccounts();
    }
    promises.push(requireAccounts(FLUX));
    return Promise.all(promises);
};
ViolationListHandler.propTypes = {
    query: React.PropTypes.object.isRequired
};
ViolationListHandler.contextTypes = {
    router: React.PropTypes.func.isRequired
};


class ViolationDetailHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <FlummoxComponent
                    flux={FLUX}
                    connectToStores={['fullstop']}>
                    <ViolationDetail
                        violationId={this.props.params.violationId}
                        userStore={USER_STORE}
                        fullstopActions={FULLSTOP_ACTIONS}
                        fullstopStore={FULLSTOP_STORE} />
                </FlummoxComponent>;
    }

}
ViolationDetailHandler.fetchData = function (state) {
    FULLSTOP_ACTIONS.fetchViolation(state.params.violationId);
    TEAM_ACTIONS.fetchAccounts();
    return requireAccounts(FLUX);
};
ViolationDetailHandler.displayName = 'ViolationDetailHandler';
ViolationDetailHandler.propTypes = {
    params: React.PropTypes.object.isRequired
};

class ViolationShortUrlHandler extends React.Component {
    constructor(props, context) {
        super();
        context.router.transitionTo('violation-vioList', null, lzw.decompressFromEncodedURIComponent(props.params.shortened));
    }

    render() {
        return <div><Icon name='circle-o-noth' spin /> Redirecting...</div>;
    }
}
ViolationShortUrlHandler.displayName = 'ViolationShortUrlHandler';
ViolationShortUrlHandler.propTypes = {
    params: React.PropTypes.object.isRequired
};
ViolationShortUrlHandler.contextTypes = {
    router: React.PropTypes.func.isRequired
};

const ROUTES =
    <Route name='violation-vioList' path='violation'>
        <DefaultRoute handler={ViolationListHandler} />
        <Route name='violation-short' path='v/:shortened' handler={ViolationShortUrlHandler} />
        <Route name='violation-vioDetail' path=':violationId' handler={ViolationDetailHandler} />
    </Route>;

export default ROUTES;
