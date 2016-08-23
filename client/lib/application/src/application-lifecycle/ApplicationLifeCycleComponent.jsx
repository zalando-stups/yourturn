import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

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
            selectedVersions: [],
            startDate : moment().subtract(1, 'weeks').startOf('day').toDate(),
            endDate : moment().endOf('day').toDate(),
            brushExtentStartDate : moment().subtract(1, 'weeks').startOf('day').toDate(),
            brushExtentEndDate : moment().endOf('day').toDate()
        };

        this.handleVersionsSelect = this.handleVersionsSelect.bind(this);
        this.handleVersionReset = this.handleVersionReset.bind(this);
        this.handleStartDatePicked = this.handleStartDatePicked.bind(this);
        this.handleEndDatePicked = this.handleEndDatePicked.bind(this);
        this.handleBrushChanged = this.handleBrushChanged.bind(this);
        this.handleRemoveVersion = this.handleRemoveVersion.bind(this);

    }

    // component's lifecycle functions

    componentDidMount() {
        this.props.aliceActions.fetchInstanceCount(this.props.params.applicationId, this.state.startDate, this.state.endDate);
    }

    componentWillReceiveProps(nextProps) {
        const versions = nextProps.aliceStore.instanceCountData.map( e => {return {id: e.version_id}});
        this.setState({
            versions,
            selectedVersions: versions
        });
    }

    // handler functions

    handleStartDatePicked(date) {
        this.handleDateChanged(moment(date).startOf('day').toDate(), this.state.endDate);
    }

    handleEndDatePicked(date) {
        this.handleDateChanged(this.state.startDate, moment(date).endOf('day').toDate());
    }

    handleDateChanged(startDate, endDate) {
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
        this.setState({selectedVersions: param});
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
                onStartDatePicked    = {this.handleStartDatePicked}
                onEndDatePicked      = {this.handleEndDatePicked}
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
