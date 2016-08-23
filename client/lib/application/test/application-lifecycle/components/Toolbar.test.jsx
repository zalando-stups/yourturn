/* globals expect */

import React from 'react';
import { mount } from 'enzyme';
import moment from 'moment';

import Toolbar from '../../../src/application-lifecycle/components/Toolbar.jsx';
import DateSelector, {STYLE_RIGHT} from 'common/src/components/functional/DateSelector.jsx';
import Brush from 'common/src/components/pure/Brush.jsx';

describe('application lifecycle\'s <Toolbar />', () => {

    it('renders two DateSelector components and one Brush component', () => {
        const startDate = moment().subtract(1, 'days').toDate();
        const endDate = new Date();
        const DATE_FORMAT = 'Do [of] MMM YY';

        const testProps = {
            brushExtentEndDate: endDate,
            brushExtentStartDate: startDate,
            brushWidth: 200,
            endDate,
            onBrushChanged: () => {},
            onEndDatePicked: () => {},
            onStartDatePicked: () => {},
            startDate
        };

        const wrapper = mount(<Toolbar {...testProps} />);

        const dateSelectorNodes = wrapper.find(DateSelector);
        const brushNodes = wrapper.find(Brush);

        expect(dateSelectorNodes.length).to.equal(2);
        expect(brushNodes.length).to.equal(1);

        expect(brushNodes.at(0).prop('width')).to.equal(testProps.brushWidth);
        expect(brushNodes.at(0).prop('startDate')).to.equal(testProps.startDate);
        expect(brushNodes.at(0).prop('endDate')).to.equal(testProps.endDate);
        expect(brushNodes.at(0).prop('startExtent')).to.equal(testProps.brushExtentStartDate);
        expect(brushNodes.at(0).prop('endExtent')).to.equal(testProps.brushExtentEndDate);
        expect(brushNodes.at(0).prop('onChange')).to.a('function');

        expect(dateSelectorNodes.at(0).prop('maxDate')).to.equal(testProps.endDate);
        expect(dateSelectorNodes.at(0).prop('defaultValue')).to.equal(testProps.startDate);
        expect(dateSelectorNodes.at(0).prop('title')).to.equal(moment(testProps.startDate).format(DATE_FORMAT));
        expect(dateSelectorNodes.at(0).prop('onDatePicked')).to.a('function');

        expect(dateSelectorNodes.at(1).prop('minDate')).to.equal(testProps.startDate);
        expect(dateSelectorNodes.at(1).prop('maxDate')).to.eql(moment().endOf('day').toDate());
        expect(dateSelectorNodes.at(1).prop('defaultValue')).to.equal(testProps.endDate);
        expect(dateSelectorNodes.at(1).prop('title')).to.equal(moment(testProps.endDate).format(DATE_FORMAT));
        expect(dateSelectorNodes.at(1).prop('alignStyle')).to.equal(STYLE_RIGHT);
        expect(dateSelectorNodes.at(1).prop('onDatePicked')).to.a('function');
    });


});