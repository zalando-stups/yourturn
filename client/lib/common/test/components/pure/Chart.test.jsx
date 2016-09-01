/* globals expect, React */

import Chart from '../../../src/components/pure/Chart.jsx'
import { AreaChart } from 'react-d3-components';

import moment from 'moment';

import { shallow } from 'enzyme';

describe('<Chart />', () => {

    it('renders a `AreaChart` d3 component with correct props', () => {
        const startDate = moment().subtract(1, 'days').toDate();
        const endDate = new Date(Date.now());
        const testProps = {
            dataSet: {events: [{timestamp: startDate.toISOString(), count: 2}]},
            endDate: endDate,
            height: 200,
            startDate: startDate,
            width: 600
        };

        const wrapper = shallow(<Chart {...testProps} />);
        const areaChartNodes = wrapper.find(AreaChart);
        const areaChartNode = areaChartNodes.at(0);

        expect(areaChartNodes.length).to.equal(1);
        expect(areaChartNode.prop('width')).to.equal(testProps.width);
        expect(areaChartNode.prop('height')).to.equal(testProps.height);
        expect(areaChartNode.prop('data')).to.exist;
        expect(areaChartNode.prop('margin')).to.exist;
        expect(areaChartNode.prop('xScale')).to.exist;
        expect(areaChartNode.prop('interpolate')).to.equal('step-after');
    });

});
