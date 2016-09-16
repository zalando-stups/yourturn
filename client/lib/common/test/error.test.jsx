/* globals expect, React */

import { shallow } from 'enzyme';
import DefaultError from '../src/error.jsx'

describe('<DefaultError />', () => {

    it('renders with complete props', () => {
        const testProps = {
            error : {
                status: 'someStatus',
                name: 'someName',
                message: 'someMessage'
            }
        };

        const wrapper = shallow(<DefaultError {...testProps} />);
        const h2Nodes = wrapper.find('h2');
        const h2Node = h2Nodes.at(0);
        const pNodes = wrapper.find('p');
        const pNode = pNodes.at(0);

        expect(h2Nodes.length).to.equal(1);
        expect(pNodes.length).to.equal(1);

        expect(h2Node.text()).to.equal(testProps.error.status + '-' + testProps.error.name);
        expect(pNode.text()).to.equal(testProps.error.message);
    });

    it('renders without name', () => {
        const testProps = {
            error : {
                status: 'someStatus',
                message: 'someMessage'
            }
        };

        const wrapper = shallow(<DefaultError {...testProps} />);
        const h2Nodes = wrapper.find('h2');
        const h2Node = h2Nodes.at(0);
        const pNodes = wrapper.find('p');
        const pNode = pNodes.at(0);

        expect(h2Nodes.length).to.equal(1);
        expect(pNodes.length).to.equal(1);

        expect(h2Node.text()).to.equal(testProps.error.status);
        expect(pNode.text()).to.equal(testProps.error.message);
    });

    it('renders without status', () => {
        const testProps = {
            error : {
                name: 'someName',
                message: 'someMessage'
            }
        };

        const wrapper = shallow(<DefaultError {...testProps} />);
        const h2Nodes = wrapper.find('h2');
        const h2Node = h2Nodes.at(0);
        const pNodes = wrapper.find('p');
        const pNode = pNodes.at(0);

        expect(h2Nodes.length).to.equal(1);
        expect(pNodes.length).to.equal(1);

        expect(h2Node.text()).to.equal(testProps.error.name);
        expect(pNode.text()).to.equal(testProps.error.message);
    });

});