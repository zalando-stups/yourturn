import React from 'react';
import {Route, DefaultRoute} from 'react-router';
import FlummoxComponent from 'flummox/component';
import FLUX from 'yourturn/src/flux';
import ViolationList from './violation-list/violation-list.jsx';
import ViolationDetail from './violation-detail/violation-detail.jsx';
import {requireAccounts} from 'common/src/util';

const FULLSTOP_ACTIONS = FLUX.getActions('fullstop'),
      FULLSTOP_STORE = FLUX.getStore('fullstop'),
      USER_STORE = FLUX.getStore('user'),
      TEAM_ACTIONS = FLUX.getActions('team'),
      TEAM_STORE = FLUX.getStore('team');


class ViolationListHandler extends React.Component {
    constructor() {
        super();
    }
    render() {
        return <FlummoxComponent
                    flux={FLUX}
                    connectToStores={['fullstop', 'team']}>
                    <ViolationList
                        userStore={USER_STORE}
                        fullstopActions={FULLSTOP_ACTIONS}
                        fullstopStore={FULLSTOP_STORE}
                        teamStore={TEAM_STORE} />
                </FlummoxComponent>;
    }
}
ViolationListHandler.displayName = 'ViolationListHandler';
ViolationListHandler.fetchData = function() {
    TEAM_ACTIONS.fetchAccounts();
    return requireAccounts(FLUX);
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

const ROUTES =
    <Route name='violation-vioList' path='violation'>
        <DefaultRoute handler={ViolationListHandler} />
        <Route name='violation-vioDetail' path=':violationId' handler={ViolationDetailHandler} />
    </Route>;

export default ROUTES;
