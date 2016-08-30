import React from 'react';
import PropsExposer from 'common/src/components/pure/PropsExposer.jsx';
import ComboBox from 'common/src/components/pure/ComboBox.jsx';
import ThreeColumns from 'common/src/components/pure/ThreeColumns.jsx';
import Dimensions from 'react-dimensions';
import Toolbar from './components/Toolbar.jsx';
import Head from './components/Head.jsx';
import Error from 'common/src/error.jsx';
import Loading from './components/Loading.jsx';
import Charts from './components/Charts.jsx';
import { getApplication } from 'common/src/data/kio/kio-getter.js'

const INITAL_WIDTH = 50;

class ApplicationLifeCycle extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            width: INITAL_WIDTH
        };

        this.widthCallback = this.widthCallback.bind(this);
    }

    widthCallback(param) {
        const newWidth = param.containerWidth;
        if (newWidth != this.state.width) {
            this.setState({
                width: newWidth
            })
        }
    }

    render() {
        const {applicationId, applications, aliceStore} = this.props,
            application = getApplication({applications}, applicationId);
        const LINK_PARAMS = {
            applicationId: applicationId
        };

        const DimensionizedPropsExposer = Dimensions()(PropsExposer(() => (<div />), this.widthCallback));

        return (
            <div>
                {aliceStore.error ?
                    <Error error = {aliceStore.error} />
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
                    brushExtentEndDate   = {this.props.brushExtentEndDate}
                    brushExtentStartDate = {this.props.brushExtentStartDate}
                    brushWidth           = {this.state.width}
                    endDate              = {this.props.endDate}
                    startDate            = {this.props.startDate}
                    onBrushChanged       = {this.props.onBrushChanged}
                    onEndDatePicked      = {this.props.onEndDatePicked}
                    onStartDatePicked    = {this.props.onStartDatePicked}
                />
                {aliceStore.isLoading ?
                    <Loading />
                    :
                    <Charts
                        applicationId   = {applicationId}
                        onDeselect      = {this.props.onRemoveVersion}
                        versions        = {this.props.selectedVersions}
                        versionDataSets = {this.props.aliceStore.instanceCountData}
                        width           = {this.state.width}
                        extentStartDate = {this.props.brushExtentStartDate}
                        extentEndDate   = {this.props.brushExtentEndDate}
                    />}
            </div>
        )
    }
}

ApplicationLifeCycle.displayName = 'ApplicationLifeCycle';

ApplicationLifeCycle.propTypes = {
    aliceStore: React.PropTypes.shape({
        error: React.PropTypes.string,
        isLoading: React.PropTypes.bool,
        instanceCountData: React.PropTypes.array
    }).isRequired,
    applicationId: React.PropTypes.string,
    applications: React.PropTypes.object.isRequired,
    brushExtentEndDate: React.PropTypes.instanceOf(Date),
    brushExtentStartDate: React.PropTypes.instanceOf(Date),
    endDate: React.PropTypes.instanceOf(Date),
    onBrushChanged: React.PropTypes.func.isRequired,
    onEndDatePicked: React.PropTypes.func.isRequired,
    onRemoveVersion: React.PropTypes.func.isRequired,
    onStartDatePicked: React.PropTypes.func.isRequired,
    onVersionReset: React.PropTypes.func.isRequired,
    onVersionsSelect: React.PropTypes.func.isRequired,
    selectedVersions: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.string
    })),
    startDate: React.PropTypes.instanceOf(Date),
    versions: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.string
    }))
}

export default ApplicationLifeCycle;