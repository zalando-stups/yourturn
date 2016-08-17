import React from 'react';
import PropsExposer from 'common/components/pure/PropsExposer.jsx';
import ComboBox from 'common/components/pure/ComboBox.jsx';
import ThreeColumns from 'common/components/pure/ThreeColumns.jsx';
import moment from 'moment';
import Dimensions from 'react-dimensions';
import Toolbar from './components/Toolbar.jsx';
import Head from './components/Head.jsx';
import Error from './components/Error.jsx';
import Loading from './components/Loading.jsx';
import Charts from './components/Charts.jsx';

const INITAL_WIDTH = 50;

class ApplicationLifeCycle extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate : moment().subtract(1, 'weeks').startOf('day').toDate(),
            endDate : moment().endOf('day').toDate(),
            brushExtentStartDate : moment().subtract(1, 'weeks').startOf('day').toDate(),
            brushExtentEndDate : moment().endOf('day').toDate(),
            width: INITAL_WIDTH
        };

        this.handleStartDatePicked = this.handleStartDatePicked.bind(this);
        this.handleEndDatePicked = this.handleEndDatePicked.bind(this);
        this.handleBrushChanged = this.handleBrushChanged.bind(this);
        this.widthCallback = this.widthCallback.bind(this);
        this.handleRemoveVersion = this.handleRemoveVersion.bind(this);
    }

    widthCallback(param) {
        const newWidth = param.containerWidth;
        if (newWidth != this.state.width) {
            this.setState({
                width: newWidth
            })
        }
    }

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
    }

    handleBrushChanged([brushExtentStartDate, brushExtentEndDate]) {
        this.setState({
            brushExtentStartDate,
            brushExtentEndDate
        });
    }

    handleRemoveVersion(versionId) {
        const { onVersionsSelect, selectedVersions } = this.props;
        onVersionsSelect(selectedVersions.filter(v => v.id != versionId));
    }

    render() {
        const {applicationId, kioStore, aliceStore} = this.props,
            application = kioStore.getApplication(applicationId);
        const LINK_PARAMS = {
            applicationId: applicationId
        };

        const DimensionizedPropsExposer = Dimensions()(PropsExposer(() => (<div />), this.widthCallback));

        return (
            <div>
                {aliceStore.error ?
                    <Error errorData = {aliceStore.error} />
                    :
                    null}
                <Head
                    linkParams  = {LINK_PARAMS}
                    application = {application.name || applicationId}
                />
                <div>
                    <ComboBox
                        value            = {this.props.selectedVersions}
                        data             = {this.props.versions}
                        onChange         = {this.props.onVersionsSelect}
                        onReset          = {this.props.onVersionReset}
                        resetButtonTitle = 'Reset'
                        title            = 'Select Versions'
                    />
                </div>
                <ThreeColumns leftChildren   = {<div style = {{height: '50px'}}></div>}
                              middleChildren = {<DimensionizedPropsExposer />}
                              rightChildren  = {<div></div>}
                />
                <Toolbar
                    brushExtentEndDate   = {this.state.brushExtentEndDate}
                    brushExtentStartDate = {this.state.brushExtentStartDate}
                    brushWidth           = {this.state.width}
                    endDate              = {this.state.endDate}
                    startDate            = {this.state.startDate}
                    onBrushChanged       = {this.handleBrushChanged}
                    onEndDatePicked      = {this.handleEndDatePicked}
                    onStartDatePicked    = {this.handleStartDatePicked}
                />
                {aliceStore.isLoading ?
                    <Loading />
                    :
                    <Charts
                        applicationId   = {applicationId}
                        onDeselect      = {this.handleRemoveVersion}
                        versions        = {this.props.selectedVersions}
                        versionDataSets = {this.props.aliceStore.serverCountData}
                        width           = {this.state.width}
                        extentStartDate = {this.state.brushExtentStartDate}
                        extentEndDate   = {this.state.brushExtentEndDate}
                    />}
            </div>
        )
    }
}

ApplicationLifeCycle.displayName = 'ApplicationLifeCycle';

ApplicationLifeCycle.propTypes = {
    aliceStore: React.PropTypes.shape({
        error: React.PropTypes.object,
        isLoading: React.PropTypes.bool,
        serverCountData: React.PropTypes.object
    }).isRequired,
    applicationId: React.PropTypes.string,
    kioStore: React.PropTypes.shape({
        getApplication: React.PropTypes.func
    }).isRequired,
    onVersionReset: React.PropTypes.func.isRequired,
    onVersionsSelect: React.PropTypes.func.isRequired,
    selectedVersions: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.string
    })),
    versions: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.string
    }))
}

export default ApplicationLifeCycle;