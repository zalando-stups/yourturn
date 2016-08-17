import Brush from '../../../components/pure/Brush.jsx'

import moment from 'moment';

import { mount } from 'enzyme';
import expect from 'expect';

describe('<Brush />', () => {

    it('renders a `Brush` component', () => {
        const startDate = moment().subtract(1, 'days').toDate();
        const endDate = new Date(Date.now());
        const testProps = {
            endDate: endDate,
            endExtent: endDate,
            height: 222,
            onChange: () => {},
            startDate: startDate,
            startExtent: startDate,
            width: 444
        };

        const wrapper = mount(<Brush {...testProps} />);
        console.log("Brush test " + wrapper.debug());

        expect(2).toBe(1);
    });

});
