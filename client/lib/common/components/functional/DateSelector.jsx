import React from 'react'

import 'react-date-picker/index.css'
import { Calendar } from 'react-date-picker'

const STYLE_LEFT = {width: "1px", height: "1px", position: "relative", top: 0, left: 0, zIndex: 10};
const STYLE_RIGHT = {width: "1px", height: "1px", position: "relative", top: 0, left: -220, zIndex: 10};
const DATE_FORMAT = "YYYY-MM-DD";

class DateSelector extends React.Component {
    constructor(props) {
        super(props);

        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleDatePicked = this.handleDatePicked.bind(this);

        this.state = {openDatePicker : false}
    }

    handleButtonClick(e) {
        e.preventDefault();
        this.setState({openDatePicker : !this.state.openDatePicker});
    }

    handleDatePicked(dateString, { dateMoment}) {
        this.setState({openDatePicker : false});
        this.props.datePicked(dateMoment.toDate());
    }

    render() {
        let dateFieldComponent = null;
        if (this.state.openDatePicker) {
            dateFieldComponent =
                <div style = {this.props.align == "right" ? STYLE_RIGHT : STYLE_LEFT}>
                    <Calendar
                        updateOnDateClick   = {true}
                        collapseOnDateClick = {true}
                        footer              = {false}
                        forceValidDate      = {true}
                        dateFormat          = {DATE_FORMAT}
                        minDate             = {this.props.minDate}
                        maxDate             = {this.props.maxDate}
                        onChange            = {this.handleDatePicked}
                        date                = {this.props.defaultValue}
                    />
                </div>
        }

        return (
            <div>
                <div
                    className = 'btn btn-danger btn-small'
                    onClick = {this.handleButtonClick}>
                    {this.props.title}
                </div>
                {dateFieldComponent}
            </div>
        )
    }

}


DateSelector.propTypes = {
    title: React.PropTypes.string,
    datePicked: React.PropTypes.func.isRequired,
    align: React.PropTypes.string,
    minDate: React.PropTypes.instanceOf(Date),
    maxDate: React.PropTypes.instanceOf(Date),
    defaultValue: React.PropTypes.instanceOf(Date)
};

export default DateSelector;
