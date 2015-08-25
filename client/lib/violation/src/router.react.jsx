import React from 'react';
import {Route, DefaultRoute} from 'react-router';
import FlummoxComponent from 'flummox/component';
import FLUX from 'yourturn/src/flux';
import ViolationList from './violation-list/violation-list.jsx';
import ViolationDetail from './violation-detail/violation-detail.jsx';
import {requireAccounts} from 'common/src/util';

const FS_ACTIONS = FLUX.getActions('fullstop'),
      TEAM_ACTIONS = FLUX.getActions('team');


class ViolationListHandler extends React.Component {
    constructor() {
        super();
    }
    render() {
        return <FlummoxComponent
                    flux={FLUX}
                    connectToStores={['fullstop', 'team']}>
                    <ViolationList />
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
                        violationId={this.props.params.violationId} />
                </FlummoxComponent>;
    }

}
ViolationDetailHandler.fetchData = function (state) {
    FS_ACTIONS.fetchViolation(state.params.violationId);
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
