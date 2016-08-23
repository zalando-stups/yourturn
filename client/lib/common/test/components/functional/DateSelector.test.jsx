/* globals expect, React */

import DateSelector from '../../../src/components/functional/DateSelector.jsx'
import { Calendar } from 'react-date-picker'

import { mount } from 'enzyme';
import moment from 'moment';


describe('<DateSelector />', () => {

    it('renders a `Calendar` component when in open state', () => {
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
        wrapper.setState({openDatePicker : true});

        const calendarNodes = wrapper.find(Calendar);
        const calendarNode = calendarNodes.at(0);

        expect(calendarNodes.length).to.equal(1);

        expect(calendarNode.prop('updateOnDateClick')).to.equal(true);
        expect(calendarNode.prop('collapseOnDateClick')).to.equal(true);
        expect(calendarNode.prop('footer')).to.equal(false);
        expect(calendarNode.prop('forceValidDate')).to.equal(true);
        expect(calendarNode.prop('onChange')).to.be.a('function');
        expect(calendarNode.prop('dateFormat')).to.equal('YYYY-MM-DD');
        expect(calendarNode.prop('minDate')).to.equal(testProps.minDate);
        expect(calendarNode.prop('maxDate')).to.equal(testProps.maxDate);
        expect(calendarNode.prop('date')).to.equal(testProps.defaultValue);
    });

    it('renders no `Calendar` component when not in open state', () => {
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
        const calendarNodes = wrapper.find(Calendar);

        expect(calendarNodes.length).to.equal(0);
    });

    it('renders a button with title independent of open state', () => {
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
        let buttonNodes = wrapper.find('.btn');
        let buttonNode = buttonNodes.at(0);

        expect(buttonNodes.length).to.equal(1);
        expect(buttonNode.text()).to.equal(testProps.title);

        wrapper.setState({openDatePicker : true});
        buttonNodes = wrapper.find('.btn');
        buttonNode = buttonNodes.at(0);

        expect(buttonNodes.length).to.equal(1);
        expect(buttonNode.text()).to.equal(testProps.title);
    });



});
