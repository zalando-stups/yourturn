import React from 'react';
import PropsExposer from 'common/components/pure/PropsExposer.jsx';
import ComboBox from 'common/components/pure/ComboBox.jsx';
import ThreeColumns from 'common/components/pure/ThreeColumns.jsx';
import moment from 'moment';
import Dimensions from 'react-dimensions';
import Toolbar from './components/toolbar.jsx';
import Head from './components/head.jsx';
import Error from './components/error.jsx';
import Loading from './components/loading.jsx';
import Charts from './components/charts.jsx';

const INITAL_WIDTH = 50;

class ApplicationLifeCycle extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate : moment().subtract(1, "weeks").startOf('day').toDate(),
            endDate : moment().endOf('day').toDate(),
            brushExtentStartDate : moment().subtract(1, "weeks").startOf('day').toDate(),
            brushExtentEndDate : moment().endOf('day').toDate(),
            width: INITAL_WIDTH
        };

        this.handleStartDatePicked = this.handleStartDatePicked.bind(this);
        this.handleEndDatePicked = this.handleEndDatePicked.bind(this);
        this.handleBrushChanged = this.handleBrushChanged.bind(this);
        this.widthCallback = this.widthCallback.bind(this);
        this.removeVersion = this.removeVersion.bind(this);
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

    removeVersion(versionId) {
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
                        onDeselect      = {this.removeVersion}
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
/*eslint-enable */

ApplicationLifeCycle.displayName = 'ApplicationLifeCycle';

export default ApplicationLifeCycle;