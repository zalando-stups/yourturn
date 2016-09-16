import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { bindActionCreators } from 'redux';

import * as AliceActions from 'common/src/data/alice/alice-action';
import * as KioActions from 'common/src/data/kio/kio-actions';

import ApplicationLifeCycle from './application-lifecycle.jsx'

class ApplicationLifecycleHandler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            versions: [],
            selectedVersions: [],
            startDate : moment().subtract(1, 'weeks').startOf('day').toDate(),
            endDate : moment().endOf('day').toDate(),
            brushExtentStartDate : moment().subtract(1, 'weeks').startOf('day').toDate(),
            brushExtentEndDate : moment().endOf('day').toDate()
        };

        this.handleVersionsSelect = this.handleVersionsSelect.bind(this);
        this.handleVersionReset = this.handleVersionReset.bind(this);
        this.handleDateChanged = this.handleDateChanged.bind(this);
        this.handleBrushChanged = this.handleBrushChanged.bind(this);
        this.handleRemoveVersion = this.handleRemoveVersion.bind(this);
    }

    // component's lifecycle functions

    componentDidMount() {
        this.props.aliceActions.fetchInstanceCount(this.props.params.applicationId, this.state.startDate, this.state.endDate);
        this.props.kioActions.fetchApplication(this.props.params.applicationId);
    }

    componentWillReceiveProps(nextProps) {
        const versions = nextProps.aliceStore.instanceCountData.map( e => {return {id: e.version_id}});
        this.setState({
            versions,
            selectedVersions: versions
        });
    }

    // handler functions

    handleDateChanged(range) {
        if (!range || range.length < 1) {
            return;
        }

        const startDate = range[0].toDate();
        const endDate = range[1].toDate();
        this.setState({
            startDate,
            endDate,
            brushExtentStartDate: startDate,
            brushExtentEndDate: endDate
        });
        this.props.aliceActions.fetchInstanceCount(this.props.params.applicationId, startDate, endDate);
    }

    handleBrushChanged([brushExtentStartDate, brushExtentEndDate]) {
        this.setState({
            brushExtentStartDate,
            brushExtentEndDate
        });
    }

    handleRemoveVersion(versionId) {
        const { selectedVersions } = this.state;
        this.handleVersionsSelect(selectedVersions.filter(v => v.id != versionId));
    }

    handleVersionsSelect(param) {
        const selectedVersions = this.state.versions.filter( v => param.indexOf(v) > -1);
        this.setState({selectedVersions});
    }

    handleVersionReset() {
        this.setState({selectedVersions: this.state.versions});
    }

    // render function

    render() {
        return (
            <ApplicationLifeCycle
                applicationId        = {this.props.params.applicationId}
                versions             = {this.state.versions}
                selectedVersions     = {this.state.selectedVersions}
                onVersionsSelect     = {this.handleVersionsSelect}
                onVersionReset       = {this.handleVersionReset}
                onDateChanged        = {this.handleDateChanged}
                onBrushChanged       = {this.handleBrushChanged}
                onRemoveVersion      = {this.handleRemoveVersion}
                startDate            = {this.state.startDate}
                endDate              = {this.state.endDate}
                brushExtentStartDate = {this.state.brushExtentStartDate}
                brushExtentEndDate   = {this.state.brushExtentEndDate}
                {...this.props} />
        );
    }
}

ApplicationLifecycleHandler.displayName = 'ApplicationLifecycleHandler';

ApplicationLifecycleHandler.propTypes = {
    aliceActions: React.PropTypes.shape({
        fetchInstanceCount: React.PropTypes.func
    }).isRequired,
    kioActions: React.PropTypes.shape({
        fetchApplication: React.PropTypes.func
    }).isRequired,
    params: React.PropTypes.shape({
        applicationId: React.PropTypes.string
    }).isRequired
};

function mapStateToProps(state) {
    return {
        aliceStore: state.alice,
        applications: state.kio.applications,
        kio: state.kio
    };
}

function mapDispatchToProps(dispatch) {
    return {
        aliceActions: bindActionCreators(AliceActions, dispatch),
        kioActions: bindActionCreators(KioActions, dispatch)
    };
}


const ConnectedApplicationLifecycleHandler = connect(mapStateToProps, mapDispatchToProps)(ApplicationLifecycleHandler);

export {
    ConnectedApplicationLifecycleHandler
}
