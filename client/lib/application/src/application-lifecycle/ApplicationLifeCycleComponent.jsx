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
        this.state = {
            versions: [],
            selectedVersions: []
        };

        this.onVersionsSelect = this.onVersionsSelect.bind(this);
        this.onVersionReset = this.onVersionReset.bind(this);
    }

    // component's lifecycle functions

    componentDidMount() {
        this.props.aliceActions.fetchServerCount('kio');
    }

    componentWillReceiveProps(nextProps) {
        const versions = nextProps.aliceStore.serverCountData.map( e => {return {id: e.version_id}});
        this.setState({
            versions,
            selectedVersions: versions
        });
    }

    // handler functions

    onVersionsSelect(param) {
        this.setState({selectedVersions: param});
    }

    onVersionReset() {
        this.setState({selectedVersions: this.state.versions});
    }

    // render function

    render() {
        return (
            <ApplicationLifeCycle
                applicationId    = {this.props.params.applicationId}
                versions         = {this.state.versions}
                selectedVersions = {this.state.selectedVersions}
                onVersionsSelect = {this.onVersionsSelect}
                onVersionReset   = {this.onVersionReset}
                {...this.props} />
        );
    }
}

ApplicationLifecycleHandler.displayName = 'ApplicationLifecycleHandler';

ApplicationLifecycleHandler.propTypes = {
    params: React.PropTypes.object.isRequired
};

const fetchData = function(routerState, state) {
    const {applicationId} = routerState.params;
    ALICE_ACTIONS.fetchServerCount(applicationId);
};

function mapStateToProps(state, ownProps) {
    return {
        aliceStore: state.alice,
        kioStore: bindGettersToState(state.kio, KioGetter)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        aliceActions: bindActionCreators(AliceActions, dispatch)
    };
}


const ConnectedApplicationLifecycleHandler = connect(mapStateToProps, mapDispatchToProps)(ApplicationLifecycleHandler);

export {
    ConnectedApplicationLifecycleHandler
}
