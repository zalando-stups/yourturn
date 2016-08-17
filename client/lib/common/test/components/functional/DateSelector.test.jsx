import React from 'react';

import DateSelector from '../../../components/functional/DateSelector.jsx'

import { mount } from 'enzyme';
import expect from 'expect';
import moment from 'moment';


describe('<DateSelector />', () => {

    console.log("here be dragons22");
    it('renders a `DateSelector` component', () => {
        const startDate = moment().subtract(1, 'days').toDate();
        const endDate = new Date(Date.now());

        const testProps = {
            defaultValue: endDate,
            maxDate: startDate,
            minDate: endDate,
            onDatePicked: () => {},
            title: 'someTitle'
        };

        const wrapper = mount(<DateSelector {...testProps} />);
        // console.log(wrapper.debug());
        wrapper.setState({openDatePicker : true});
        // console.log(wrapper.debug());

        expect(2).toBe(1);
    });

});
