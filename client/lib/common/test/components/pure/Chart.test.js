import Chart from '../../../components/pure/Chart.jsx'

import moment from 'moment';

import { mount } from 'enzyme';
import expect from 'expect';

describe('<Chart pure />', () => {

    it('renders a pure `Chart` component', () => {
        const startDate = moment().subtract(1, 'days').toDate();
        const endDate = new Date(Date.now());
        const testProps = {
            dataSet: {events: [{timestamp: startDate, count: 2}]},
            endDate: endDate,
            height: 200,
            startDate: startDate,
            width: 600
        };

        const wrapper = mount(<Chart {...testProps} />);
        console.log("char test " + wrapper.debug());

        expect(2).toBe(1);
    });

});
