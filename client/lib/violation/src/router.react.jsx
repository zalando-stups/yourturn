import React from 'react';
import {Route, DefaultRoute} from 'react-router';
import FlummoxComponent from 'flummox/component';
import {requireTeam} from 'common/src/util';
import Flux from './flux';
import ViolationList from './violation-list/violation-list.jsx';
import ViolationDetail from './violation-detail/violation-detail.jsx';

const VIO_FLUX = new Flux(),
    VIO_ACTIONS = VIO_FLUX.getActions('fullstop');


class ViolationListHandler extends React.Component {
    constructor() {
        super();
    }
    render() {
        return <FlummoxComponent
                    flux={VIO_FLUX}
                    globalFlux={this.props.globalFlux}
                    connectToStores={['fullstop']}>
                    <ViolationList />
                </FlummoxComponent>;
    }
}
ViolationListHandler.displayName = 'ViolationListHandler';
ViolationListHandler.propTypes = {
    globalFlux: React.PropTypes.object.isRequired
};
ViolationListHandler.fetchData = function (state, globalFlux) {
    return requireTeam(globalFlux)
            .then(() => {
                let userStore = globalFlux.getStore('user'),
                    accounts = userStore.getUserCloudAccounts();
                VIO_ACTIONS.fetchViolations(accounts.map(a => a.id));
            });
};

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
    VIO_ACTIONS.fetchViolation(state.params.violationId);
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
