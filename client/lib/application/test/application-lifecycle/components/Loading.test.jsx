/* globals expect */

import React from 'react';
import { mount } from 'enzyme';
import Icon from 'react-fa';

import Loading from '../../../src/application-lifecycle/components/Loading.jsx';

describe('application lifecycle\'s <Loading />', () => {

    it('renders spinning icon', () => {

        const testProps = {
        };

        const wrapper = mount(<Loading {...testProps} />);

        const iconNodes = wrapper.find(Icon);
        const iconNode = iconNodes.at(0);

        expect(iconNodes.length).to.equal(1);
        expect(iconNode.prop('pulse')).to.be.true;
        expect(iconNode.prop('name')).to.equal('spinner');
    });


});