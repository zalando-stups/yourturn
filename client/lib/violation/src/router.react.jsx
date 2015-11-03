import React from 'react';
import {Route, DefaultRoute} from 'react-router';
import FlummoxComponent from 'flummox/component';
import FLUX from 'yourturn/src/flux';
import Violation from './violation/violation.jsx';
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
    // global parameters
    if (params.accounts) {
        result.accounts = params.accounts;
    }
    if (params.from) {
        result.from = moment(params.from);
    }
    if (params.to) {
        result.to = moment(params.to);
    }
    if (params.activeTab) {
        result.activeTab = parseInt(params.activeTab, 10);
    }
    if (params.showUnresolved) {
        result.showUnresolved = params.showUnresolved === 'true';
    }
    if (params.showResolved) {
        result.showResolved = params.showResolved === 'true';
    }

    // tab-specific parameters
    Object
    .keys(params)
    .forEach(param => {
        // they look like tab_variableCamelCase
        let [tab, variable] = param.split('_');
        if (variable) {
            if (!result[tab]) {
                result[tab] = {};
            }
            if (['true', 'false'].indexOf(params[param]) >= 0) {
                result[tab][variable] = params[param] === 'true';
            } else {
                result[tab][variable] = params[param];
            }
        }
    });
    return result;
}

class ViolationHandler extends React.Component {
    constructor() {
        super();
    }
    render() {
        return <FlummoxComponent
                    flux={FLUX}
                    connectToStores={['fullstop', 'team']}>
                    <Violation
                        notificationActions={NOTIFICATION_ACTIONS}
                        userStore={USER_STORE}
                        fullstopActions={FULLSTOP_ACTIONS}
                        fullstopStore={FULLSTOP_STORE}
                        teamStore={TEAM_STORE} />
                </FlummoxComponent>;
    }
}
ViolationHandler.displayName = 'ViolationHandler';
ViolationHandler.fetchData = function(router) {
    let promises = [];
    // if there are query params we have to pre-set those as search parameters
    if (!_.isEmpty(router.query)) {
        FULLSTOP_ACTIONS.updateSearchParams(parseQueryParams(router.query));
        let searchParams = FULLSTOP_STORE.getSearchParams();
        // tab-specific loadings
        // tab 1
        FULLSTOP_ACTIONS.fetchViolationCount(searchParams);
        // tab 2
        FULLSTOP_ACTIONS.fetchViolationCountIn(
            searchParams.cross ? searchParams.cross.inspectedAccount : searchParams.accounts[0],
            searchParams);
        // tab 3
        FULLSTOP_ACTIONS.fetchViolations(searchParams);
    }
    if (!Object.keys(FULLSTOP_STORE.getViolationTypes()).length) {
        promises.push(FULLSTOP_ACTIONS.fetchViolationTypes());
    }
    // if there aren't any teams from team service yet, fetch them NAO
    if (!TEAM_STORE.getAccounts().length) {
        TEAM_ACTIONS.fetchAccounts();
    }
    promises.push(requireAccounts(FLUX));
    return Promise.all(promises);
};
ViolationHandler.propTypes = {
    query: React.PropTypes.object.isRequired
};
ViolationHandler.contextTypes = {
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
        context.router.transitionTo('violation', null, JSON.parse(lzw.decompressFromEncodedURIComponent(props.params.shortened)));
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
    <Route name='violation' path='violation'>
        <DefaultRoute handler={ViolationHandler} />
        <Route name='violation-short' path='v/:shortened' handler={ViolationShortUrlHandler} />
        <Route name='violation-vioDetail' path=':violationId' handler={ViolationDetailHandler} />
    </Route>;

export default ROUTES;
