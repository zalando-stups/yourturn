/* globals expect, React */

import ZBrush from '../../../src/components/pure/Brush.jsx'
import { Brush } from 'react-d3-components';

import moment from 'moment';
import { shallow } from 'enzyme';

describe('<Brush />', () => {

    it('renders a `Brush` d3 component with correct props', () => {
        const startDate = moment().subtract(1, 'days').toDate();
        const endDate = new Date(Date.now());
        const testProps = {
            endDate,
            endExtent: endDate,
            height: 222,
            onChange: () => {},
            startDate,
            startExtent: startDate,
            width: 444
        };

        const wrapper = shallow(<ZBrush {...testProps} />);
        const brushNodes = wrapper.find(Brush);
        const brushNode = brushNodes.at(0);

        expect(brushNodes.length).to.equal(1);
        expect(brushNode.prop('width')).to.equal(testProps.width);
        expect(brushNode.prop('height')).to.equal(testProps.height);
        expect(brushNode.prop('margin')).to.exist;
        expect(brushNode.prop('xScale')).to.exist;
        expect(brushNode.prop('extent')).to.eql([testProps.startDate, testProps.endDate]);
        expect(brushNode.prop('onChange')).to.be.a('function');
    });

});
