/* globals expect */

import React from 'react';
import { mount } from 'enzyme';
import moment from 'moment';

import Toolbar from '../../../src/application-lifecycle/components/Toolbar.jsx';
import DateDropdown from 'common/src/components/functional/date-dropdown.jsx';
import Brush from 'common/src/components/pure/Brush.jsx';

describe('application lifecycle\'s <Toolbar />', () => {

    it('renders a \'DateDropdown\' component and a \'Brush\' component', () => {
        const startDate = moment().subtract(1, 'days').toDate();
        const endDate = new Date();

        const testProps = {
            brushExtentEndDate: endDate,
            brushExtentStartDate: startDate,
            brushWidth: 200,
            endDate,
            onBrushChanged: () => {},
            onDateChanged: () => {},
            startDate
        };

        const wrapper = mount(<Toolbar {...testProps} />);

        const dateSelectorNodes = wrapper.find(DateDropdown);
        const brushNodes = wrapper.find(Brush);

        expect(dateSelectorNodes.length).to.equal(1);
        expect(brushNodes.length).to.equal(1);

        expect(brushNodes.at(0).prop('width')).to.equal(testProps.brushWidth);
        expect(brushNodes.at(0).prop('startDate')).to.equal(testProps.startDate);
        expect(brushNodes.at(0).prop('endDate')).to.equal(testProps.endDate);
        expect(brushNodes.at(0).prop('startExtent')).to.equal(testProps.brushExtentStartDate);
        expect(brushNodes.at(0).prop('endExtent')).to.equal(testProps.brushExtentEndDate);
        expect(brushNodes.at(0).prop('onChange')).to.a('function');

        expect(dateSelectorNodes.at(0).prop('range')).to.eql([testProps.startDate, testProps.endDate]);
        expect(dateSelectorNodes.at(0).prop('onUpdate')).to.a('function');
    });


});