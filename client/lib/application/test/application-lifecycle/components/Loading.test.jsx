/* globals expect */

import React from 'react';
import { mount } from 'enzyme';

import Loading from '../../../src/application-lifecycle/components/Loading.jsx';
import Spinner from '../../../../common/src/components/pure/Spinner.jsx';

describe('application lifecycle\'s <Loading />', () => {

    it('renders spinning icon', () => {

        const testProps = {
        };

        const wrapper = mount(<Loading {...testProps} />);

        const spinnerNodes = wrapper.find(Spinner);
        const spinnerNode = spinnerNodes.at(0);

        expect(spinnerNodes.length).to.equal(1);
        expect(spinnerNode.prop('size')).to.equal('5x');
    });


});