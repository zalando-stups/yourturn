import React from 'react';
import Icon from 'react-fa';
import { Link } from 'react-router';
import * as Routes from 'application/src/routes';
import PropsExposer from 'common/components/pure/PropsExposer.jsx';
import ComboBox from 'common/components/pure/ComboBox.jsx';
import ThreeColumns from 'common/components/pure/ThreeColumns.jsx';
import TitleWithButton from 'common/components/pure/TitleWithButton.jsx';
import Brush from 'common/components/pure/Brush.jsx';
import DateSelector from 'common/components/functional/DateSelector.jsx';
import Chart from 'common/components/pure/Chart.jsx';
import moment from 'moment';
import Dimensions from 'react-dimensions'

const DATE_FORMAT = 'Do [of] MMM YY';
const OUTER_STYLE = {padding: "40px"};


class ApplicationLifeCycle extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate : moment().subtract(1, "weeks").startOf('day').toDate(),
            endDate : moment().endOf('day').toDate(),
            brushExtentStartDate : moment().subtract(1, "weeks").startOf('day').toDate(),
            brushExtentEndDate : moment().endOf('day').toDate(),
            width: 100
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
        const {applicationId, kioStore} = this.props,
            application = kioStore.getApplication(applicationId);
        const LINK_PARAMS = {
            applicationId: applicationId
        };

        const WrappedPropsExposer = Dimensions()(PropsExposer(() => (<div />), this.widthCallback));

        const childrenForThreeColumns = this.props.selectedVersions.map((version, index) => {
            const versionDataSet = this.props.aliceStore.serverCountData.find(e => e.version_id == version.id);
            return (
                <ThreeColumns key = {index}
                              leftChildren   = {<TitleWithButton
                                                    title   = {version.id}
                                                    onClick = {() => this.removeVersion(version.id)}
                                                    />}
                              middleChildren = {<Chart
                                                    height    = {200}
                                                    width     = {this.state.width}
                                                    startDate = {this.state.brushExtentStartDate}
                                                    endDate   = {this.state.brushExtentEndDate}
                                                    dataSet   = {versionDataSet}
                                                />}
                              rightChildren  = {<div><Link
                                                        to={Routes.verApproval({
                                                            applicationId: applicationId,
                                                            versionId: version.id})}
                                                        className='btn btn-default btn-small'>
                                                            <Icon name='check' />
                                                </Link></div>}
                />
            );
        });

        const brush = <Brush
            width       = {this.state.width}
            height      = {50}
            startDate   = {this.state.startDate}
            endDate     = {this.state.endDate}
            startExtent = {this.state.brushExtentStartDate}
            endExtent   = {this.state.brushExtentEndDate}
            onChange    = {this.handleBrushChanged}
        />;

        const startDateSelector = <DateSelector
            datePicked   = {this.handleStartDatePicked}
            title        = 'Select Start Date'
            defaultValue = {this.state.startDate}
            maxDate      = {this.state.endDate}
        />;

        const endDateSelector = <DateSelector
            datePicked   = {this.handleEndDatePicked}
            title        = 'Select End Date'
            align        = 'right'
            defaultValue = {this.state.endDate}
            minDate      = {this.state.startDate}
            maxDate      = {moment().endOf('day').toDate()}
        />;

        return (
            <div>
                <h2>
                    {this.props.containerWidth}
                    <Link
                        to={Routes.appDetail(LINK_PARAMS)}>
                        {application.name || applicationId}'s
                    </Link> application lifecycle
                </h2>
                <div className='btn-group'>
                    <Link
                        to={Routes.appDetail(LINK_PARAMS)}
                        className='btn btn-default'>
                        <Icon name='chevron-left' /> {application.name || applicationId}
                    </Link>
                </div>
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
                <ThreeColumns leftChildren   = {<h3>{moment(this.state.startDate).format(DATE_FORMAT)}</h3>}
                              middleChildren = {<WrappedPropsExposer />}
                              rightChildren  = {<h3>{moment(this.state.endDate).format(DATE_FORMAT)}</h3>}
                />
                <ThreeColumns leftChildren   = {startDateSelector}
                              middleChildren = {brush}
                              rightChildren  = {endDateSelector}
                />
                {childrenForThreeColumns}

            </div>
        )
    }
}

export default ApplicationLifeCycle;