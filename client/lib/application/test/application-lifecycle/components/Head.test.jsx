/* globals expect */

import React from 'react';
import { shallow } from 'enzyme';
import { Link } from 'react-router';

import Head from '../../../src/application-lifecycle/components/Head.jsx';

describe('application lifecycle\'s <Head /> component', () => {

    it('should contain two \'Link\' components having the same \'to\' prop', () => {
        const testProps = {
            linkParams: {
                applicationId: 'someId'
            },
            application: 'somestring'
        };

        const wrapper = shallow(<Head {...testProps} />);

        const linkNodes = wrapper.find(Link);
        const firstNode = linkNodes.at(0);
        const secondNode = linkNodes.at(1);

        expect(linkNodes.length).to.equal(2);

        expect(firstNode.prop('to')).to.contain(testProps.linkParams.applicationId);
        expect(firstNode.prop('to')).to.equal(secondNode.prop('to'));
    });

});
