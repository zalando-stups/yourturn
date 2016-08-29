import React from 'react';
import 'react-date-picker/index.css'
import { Calendar } from 'react-date-picker'
import listenToOutsideClick from 'react-onclickoutside/decorator';

const DATE_FORMAT = 'YYYY-MM-DD';

class OutsideClickAwareCalendar extends React.Component {
    constructor(props) {
        super(props);

        this.handleDatePicked = this.handleDatePicked.bind(this);
    }

    handleDatePicked(dateString, { dateMoment}) {
        if (onDatePicked) {
            this.props.onDatePicked(dateMoment.toDate());
        }
    }
    handleClickOutside() {
        console.log("handleClickOutside");
    }

    render() {
        return (
            <Calendar
                updateOnDateClick={true}
                collapseOnDateClick={true}
                footer={false}
                forceValidDate={true}
                dateFormat={DATE_FORMAT}
                minDate={this.props.minDate}
                maxDate={this.props.maxDate}
                onChange={this.handleDatePicked}
                date={this.props.defaultValue}
            />
        );
    }

}

OutsideClickAwareCalendar.propTypes = {
    defaultValue: React.PropTypes.instanceOf(Date),
    maxDate: React.PropTypes.instanceOf(Date),
    minDate: React.PropTypes.instanceOf(Date),
    onDatePicked: React.PropTypes.func.isRequired,
    onClickOutside: React.PropTypes.func.isRequired
};


export default listenToOutsideClick(OutsideClickAwareCalendar);
