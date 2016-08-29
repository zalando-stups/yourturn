import React from 'react'

import 'react-date-picker/index.css'
import { Calendar } from 'react-date-picker'
import OutsideClickAwareCalendar from './OutsideClickAwareCalendar';

const STYLE_LEFT = {width: '1px', height: '1px', position: 'relative', top: 0, left: 0, zIndex: 10};
const STYLE_RIGHT = {width: '1px', height: '1px', position: 'relative', top: 0, left: -220, zIndex: 10};

class DateSelector extends React.Component {
    constructor(props) {
        super(props);

        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleDatePicked = this.handleDatePicked.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);

        this.state = {openDatePicker : false}
    }

    handleButtonClick(e) {
        e.preventDefault();
        this.setState({openDatePicker : !this.state.openDatePicker});
    }

    handleDatePicked(date) {
        this.setState({openDatePicker : false});
        this.props.onDatePicked(date);
    }

    render() {
        let dateFieldComponent = null;
        if (this.state.openDatePicker) {
            dateFieldComponent =
                <div style = {this.props.alignStyle}>
                    <OutsideClickAwareCalendar
                        minDate             = {this.props.minDate}
                        maxDate             = {this.props.maxDate}
                        onChange            = {this.handleDatePicked}
                        date                = {this.props.defaultValue}
                        onClickOutside      = {this.handleClickOutside}
                    />
                </div>
        }

        return (
            <div>
                <div
                    className = 'btn btn-primary'
                    onClick = {this.handleButtonClick}>
                    {this.props.title}
                </div>
                {dateFieldComponent}
            </div>
        )
    }
}


DateSelector.propTypes = {
    alignStyle: React.PropTypes.object,
    defaultValue: React.PropTypes.instanceOf(Date),
    maxDate: React.PropTypes.instanceOf(Date),
    minDate: React.PropTypes.instanceOf(Date),
    onDatePicked: React.PropTypes.func.isRequired,
    title: React.PropTypes.string
};

DateSelector.defaultProps = {
    alignStyle: STYLE_LEFT
}

export {
    DateSelector as default,
    STYLE_LEFT,
    STYLE_RIGHT
};
