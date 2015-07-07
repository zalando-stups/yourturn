import React from 'react';
import Daypicker from 'react-day-picker';
import Icon from 'react-fa';
import moment from 'moment';
import Timestamp from 'react-time';
import {DATE_FORMAT} from 'common/src/config';
import 'common/asset/less/common/datepicker.less';

class Datepicker extends React.Component {
    constructor(props) {
        super();
        this.state = {
            selectedDay: props.selectedDay || moment().startOf('day'),
            toggled: false
        };
        this.dayPickerModifiers = {
            disabled: day => day.getTime() > Date.now(),
            selected: day => day.toISOString() === this.state.selectedDay.toISOString()
        };
    }

    onDayClick(evt, day) {
        this.setState({
            selectedDay: day,
            toggled: false
        });
        this.props.onChange(day);
    }

    toggle() {
        this.setState({
            toggled: !this.state.toggled
        });
    }

    render() {
        let {toggled, selectedDay} = this.state;
        return <div className='datepicker'>
                    <div
                        onClick={this.toggle.bind(this)}
                        className='btn btn-default'>
                        <Icon name='calendar-o' /> <Timestamp value={selectedDay} format={DATE_FORMAT} />
                    </div>
                    {toggled ?
                        <Daypicker
                            onDayClick={this.onDayClick.bind(this)}
                            modifiers={this.dayPickerModifiers}
                            enableOutsideDays={true} />
                        :
                        null}
                </div>;
    }
}
Datepicker.displayName = 'Datepicker';
Datepicker.propTypes = {
    selectedDay: React.PropTypes.date,
    onChange: React.PropTypes.func.isRequired
};
export default Datepicker;
