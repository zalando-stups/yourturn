import React from 'react';
import Icon from 'react-fa';
import { Link } from 'react-router';
import * as Routes from 'application/src/routes';
import ComboBox from 'common/components/pure/ComboBox.jsx';
import ThreeColumns from 'common/components/pure/ThreeColumns.jsx';
import TitleWithButton from 'common/components/pure/TitleWithButton.jsx';
import DateSelector from 'common/components/functional/DateSelector.jsx';
import moment from 'moment';

class ApplicationLifeCycle extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedVersions: [],
            startDate : moment().subtract(1, "weeks").startOf('day').toDate(),
            endDate : moment().endOf('day').toDate()
        };

        this.onComboBoxSelect = this.onComboBoxSelect.bind(this);
        this.onComboBoxReset = this.onComboBoxReset.bind(this);

        this.handleStartDatePicked = this.handleStartDatePicked.bind(this);
        this.handleEndDatePicked = this.handleEndDatePicked.bind(this);
    }

    onComboBoxSelect(param) {
        this.setState({selectedVersions: param});
        console.log("onComboBoxSelect %O", param);
    }

    onComboBoxReset() {
        this.setState({selectedVersions: []});
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
            endDate
        });
    }

    render() {
        const {applicationId, kioStore} = this.props,
            application = kioStore.getApplication(applicationId);
        const LINK_PARAMS = {
            applicationId: applicationId
        };

        console.log("ApplicationLifeCycle props: %O", this.props);
        console.log("ApplicationLifeCycle state: %O", this.state);

        const childrenForThreeColumns = this.props.versions.map(version => {
            return {
                left:   <TitleWithButton title = {version.id} />,
                middle: <div> Middle </div>,
                right:  <div>
                            <Link
                                to={Routes.verApproval({
                                    applicationId: applicationId,
                                    versionId: version.id})}
                                className='btn btn-default btn-small'>
                                <Icon name='check' />
                            </Link>
                        </div>
            }
        });

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
                <ThreeColumns leftChildren = {startDateSelector}
                              rightChildren = {endDateSelector}
                />
                {childrenForThreeColumns.map( (element, index) =>
                    <ThreeColumns key = {index}
                                  leftChildren = {element.left}
                                  middleChildren = {element.middle}
                                  rightChildren = {element.right}
                    />
                )}

            </div>
        )
    }
}

export default ApplicationLifeCycle;