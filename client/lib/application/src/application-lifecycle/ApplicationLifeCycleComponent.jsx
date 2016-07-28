import React from 'react';
import {connect} from 'react-redux';

import REDUX from 'yourturn/src/redux';
import {parseArtifact} from 'application/src/util';
import {
    bindGettersToState,
    bindActionsToStore
} from 'common/src/util';

import * as KioGetter from 'common/src/data/kio/kio-getter';
import * as AliceActions from 'common/src/data/alice/alice-action';

import ApplicationLifeCycle from './application-lifecycle.jsx'

const ALICE_ACTIONS = bindActionsToStore(REDUX, AliceActions);

class ApplicationLifecycleHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <ApplicationLifeCycle
            applicationId={this.props.params.applicationId}
            {...this.props} />;
    }
}

ApplicationLifecycleHandler.displayName = 'ApplicationLifecycleHandler';

ApplicationLifecycleHandler.propTypes = {
    params: React.PropTypes.object.isRequired
};

const fetchData = function(routerState, state) {
    console.log("routerState %O", routerState);
    let {applicationId} = routerState.params;
    ALICE_ACTIONS.fetchServerCount(applicationId);
};

function mapStateToProps(state, ownProps) {
    console.log("mapStateToProps %O", state);
    return {
        aliceStore: state.alice,
        kioStore: bindGettersToState(state.kio, KioGetter)
    };
}

let ConnectedApplicationLifecycleHandler = connect(mapStateToProps)(ApplicationLifecycleHandler);

export {
    ConnectedApplicationLifecycleHandler,
    fetchData as ConnectedApplicationLifecycleFetchData
}
