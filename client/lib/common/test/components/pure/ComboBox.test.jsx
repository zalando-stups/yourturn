/* globals expect, React */

import ComboBox from '../../../src/components/pure/ComboBox.jsx'
import Multiselect from 'react-widgets/lib/Multiselect'
import { shallow } from 'enzyme';

describe('<ComboBox />', () => {

    it('renders with default props', () => {
        const testProps = {
            data: [{}],
            onChange: () => {},
            onReset: () => {},
            value: [{id: 'someId'}],
            title: 'someTitle'
        };

        const wrapper = shallow(<ComboBox {...testProps} />);
        const multiselectNodes = wrapper.find(Multiselect);
        const multiselectNode = multiselectNodes.at(0);
        const buttonNodes = wrapper.find('.btn');
        const buttonNode = buttonNodes.at(0);
        const titleNodes = wrapper.find('span');
        const titleNode = titleNodes.at(0);

        expect(multiselectNode.length).to.equal(1);
        expect(buttonNode.length).to.equal(1);
        expect(titleNode.length).to.equal(1);

        expect(titleNode.text()).to.equal(testProps.title + ':');
        expect(buttonNode.text()).to.equal('Reset');
        expect(multiselectNode.prop('textField')).to.equal('id');
        expect(multiselectNode.prop('valueField')).to.equal('id');
    });

    it('renders a title, an `Multiselect` component, and a button', () => {
        const testProps = {
            data: [{}],
            onChange: () => {},
            onReset: () => {},
            value: [{someProp: 'someId'}],
            resetButtonTitle: 'resetButtonTitle',
            textField: 'someProp',
            title: 'title',
            valueField: 'someProp'
        };

        const wrapper = shallow(<ComboBox {...testProps} />);
        const multiselectNodes = wrapper.find(Multiselect);
        const multiselectNode = multiselectNodes.at(0);
        const buttonNodes = wrapper.find('.btn');
        const buttonNode = buttonNodes.at(0);
        const titleNodes = wrapper.find('span');
        const titleNode = titleNodes.at(0);

        expect(multiselectNode.length).to.equal(1);
        expect(buttonNode.length).to.equal(1);
        expect(titleNode.length).to.equal(1);

        expect(titleNode.text()).to.equal(testProps.title + ':');

        expect(buttonNode.text()).to.equal(testProps.resetButtonTitle);
        expect(buttonNode.prop('onClick')).to.be.a('function');


        expect(multiselectNode.prop('data')).to.equal(testProps.data);
        expect(multiselectNode.prop('textField')).to.equal(testProps.textField);
        expect(multiselectNode.prop('valueField')).to.equal(testProps.valueField);
        expect(multiselectNode.prop('value')).to.equal(testProps.value);
        expect(multiselectNode.prop('onChange')).to.be.a('function');
    });


});
