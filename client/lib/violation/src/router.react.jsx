import React from 'react';
import {Route, DefaultRoute} from 'react-router';
import FlummoxComponent from 'flummox/component';
import Flux from './flux';
import ViolationList from './violation-list/violation-list.jsx';
import ViolationDetail from './violation-detail/violation-detail.jsx';
import {requireAccounts} from 'common/src/util';

const VIO_FLUX = new Flux(),
    FS_ACTIONS = VIO_FLUX.getActions('fullstop'),
    TEAM_ACTIONS = VIO_FLUX.getActions('team');


class ViolationListHandler extends React.Component {
    constructor() {
        super();
    }
    render() {
        return <FlummoxComponent
                    flux={VIO_FLUX}
                    globalFlux={this.props.globalFlux}
                    connectToStores={['fullstop', 'team']}>
                    <ViolationList />
                </FlummoxComponent>;
    }
}
ViolationListHandler.displayName = 'ViolationListHandler';
ViolationListHandler.propTypes = {
    globalFlux: React.PropTypes.object.isRequired
};
ViolationListHandler.fetchData = function(state, globalFlux) {
    TEAM_ACTIONS.fetchAccounts();
    return requireAccounts(globalFlux);
}

class ViolationDetailHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <FlummoxComponent
                    flux={VIO_FLUX}
                    connectToStores={['fullstop']}>
                    <ViolationDetail
                        violationId={this.props.params.violationId} />
                </FlummoxComponent>;
    }

}
ViolationDetailHandler.fetchData = function (state) {
    FS_ACTIONS.fetchViolation(state.params.violationId);
};
ViolationDetailHandler.displayName = 'ViolationDetailHandler';
ViolationDetailHandler.propTypes = {
    globalFlux: React.PropTypes.object.isRequired,
    params: React.PropTypes.object.isRequired
};

const ROUTES =
    <Route name='violation-vioList' path='violation'>
        <DefaultRoute handler={ViolationListHandler} />
        <Route name='violation-vioDetail' path=':violationId' handler={ViolationDetailHandler} />
    </Route>;

export default ROUTES;
