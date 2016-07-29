import React from 'react';
import { connect } from 'react-redux';

import { parseArtifact } from 'application/src/util';
import { bindActionCreators } from 'redux';
import { bindGettersToState } from 'common/src/util';

import * as KioGetter from 'common/src/data/kio/kio-getter';
import * as AliceActions from 'common/src/data/alice/alice-action';

import ApplicationLifeCycle from './application-lifecycle.jsx'

class ApplicationLifecycleHandler extends React.Component {
    constructor(props) {
        super(props);
        console.log("constructor props: %O", props);
    }

    componentDidMount() {
        console.log("componentDidMount %O", this.props);
        this.props.actions.fetchServerCount('kio');
    }

    componentWillReceiveProps(nextProps) {
        console.log("componentWillReceiveProps %O", nextProps);
    }

    render() {
        console.log("render props: %O", this.props);

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

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(AliceActions, dispatch)
    };
}


const ConnectedApplicationLifecycleHandler = connect(mapStateToProps, mapDispatchToProps)(ApplicationLifecycleHandler);

export {
    ConnectedApplicationLifecycleHandler
}
