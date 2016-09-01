/* globals expect, React */

import TitleWithButton from '../../../src/components/pure/TitleWithButton.jsx'
import { shallow } from 'enzyme';

describe('<TitleWithButton />', () => {

    it('renders a title and a button', () => {
        const testProps = {
            onClick: () => {},
            title: 'title'
        };

        const wrapper = shallow(<TitleWithButton {...testProps} />);

        const titleNodes = wrapper.find('span');
        const buttonNodes = wrapper.find('.btn');
        const titleNode = titleNodes.at(0);
        const buttonNode = buttonNodes.at(0);

        expect(buttonNode.length).to.equal(1);
        expect(titleNode.length).to.equal(1);

        expect(titleNode.text()).to.equal(testProps.title);
        expect(buttonNode.prop('onClick')).to.be.a('function');
    });


});
