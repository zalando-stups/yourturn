import React from 'react';
import ComboBox from 'common/src/components/pure/ComboBox.jsx';
import Toolbar from './components/Toolbar.jsx';
import Head from './components/Head.jsx';
import Error from 'common/src/error.jsx';
import Loading from './components/Loading.jsx';
import Charts from './components/Charts.jsx';
import { getApplication } from 'common/src/data/kio/kio-getter.js'
import Dimensions from 'react-dimensions';

const SIDES_WIDTH = 400;
const MINIMUM_WIDTH = 400;

/*eslint-disable react/prefer-stateless-function */
// this needs to be a component class since Dimensions is using refs and refs cannot be used for stateless functional components
class ApplicationLifeCycle extends React.Component {
    render () {
        const props = this.props;
        const {applicationId, applications, aliceStore} = props,
            application = getApplication({applications}, applicationId);
        const LINK_PARAMS = {
            applicationId: applicationId
        };

        const chartsWidth = Math.max(props.containerWidth - SIDES_WIDTH, MINIMUM_WIDTH);

        return (
            <div>
                {aliceStore.error ?
                    <Error error={aliceStore.error} />
                    :
                    null}
                <Head
                    linkParams={LINK_PARAMS}
                    application={application.name || applicationId}
                />
                <div>
                    <ComboBox
                        value={props.selectedVersions}
                        data={props.versions}
                        onChange={props.onVersionsSelect}
                        onReset={props.onVersionReset}
                        resetButtonTitle='Reset'
                        title='Select Versions'
                    />
                </div>
                <Toolbar
                    brushExtentEndDate={props.brushExtentEndDate}
                    brushExtentStartDate={props.brushExtentStartDate}
                    brushWidth={chartsWidth}
                    endDate={props.endDate}
                    startDate={props.startDate}
                    onBrushChanged={props.onBrushChanged}
                    onDateChanged={props.onDateChanged}
                />
                {aliceStore.isLoading ?
                    <Loading />
                    :
                    <Charts
                        application ={application}
                        applicationId={applicationId}
                        onDeselect={props.onRemoveVersion}
                        versions={props.selectedVersions}
                        versionDataSets={props.aliceStore.instanceCountData}
                        width={chartsWidth}
                        extentStartDate={props.brushExtentStartDate}
                        extentEndDate={props.brushExtentEndDate}
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
    onDateChanged: React.PropTypes.func.isRequired,
    onRemoveVersion: React.PropTypes.func.isRequired,
    onVersionReset: React.PropTypes.func.isRequired,
    onVersionsSelect: React.PropTypes.func.isRequired,
    selectedVersions: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.string
    })),
    startDate: React.PropTypes.instanceOf(Date),
    versions: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.string
    })),
    width: React.PropTypes.number
}

export default Dimensions()(ApplicationLifeCycle);
/*eslint-enable react/prefer-stateless-function */