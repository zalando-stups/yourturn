import React from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import { bindGettersToState } from 'common/src/util';

import * as KioGetter from 'common/src/data/kio/kio-getter';
import * as AliceActions from 'common/src/data/alice/alice-action';

import ApplicationLifeCycle from './application-lifecycle.jsx'

class ApplicationLifecycleHandler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            versions: [],
            selectedVersions: []
        };

        this.handleVersionsSelect = this.handleVersionsSelect.bind(this);
        this.handleVersionReset = this.handleVersionReset.bind(this);
    }

    // component's lifecycle functions

    componentDidMount() {
        this.props.aliceActions.fetchServerCount(this.props.params.applicationId);
    }

    componentWillReceiveProps(nextProps) {
        const versions = nextProps.aliceStore.serverCountData.map( e => {return {id: e.version_id}});
        this.setState({
            versions,
            selectedVersions: versions
        });
    }

    // handler functions

    handleVersionsSelect(param) {
        this.setState({selectedVersions: param});
    }

    handleVersionReset() {
        this.setState({selectedVersions: this.state.versions});
    }

    // render function

    render() {
        return (
            <ApplicationLifeCycle
                applicationId    = {this.props.params.applicationId}
                versions         = {this.state.versions}
                selectedVersions = {this.state.selectedVersions}
                onVersionsSelect = {this.handleVersionsSelect}
                onVersionReset   = {this.handleVersionReset}
                {...this.props} />
        );
    }
}

ApplicationLifecycleHandler.displayName = 'ApplicationLifecycleHandler';

ApplicationLifecycleHandler.propTypes = {
    aliceActions: React.PropTypes.shape({
        fetchServerCount: React.PropTypes.func
    }).isRequired,
    params: React.PropTypes.shape({
        applicationId: React.PropTypes.string
    }).isRequired
};

function mapStateToProps(state) {
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
