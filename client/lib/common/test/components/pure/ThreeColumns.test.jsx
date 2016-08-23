/* globals expect, React */

import ThreeColumns from '../../../src/components/pure/ThreeColumns.jsx'
import { mount } from 'enzyme';

describe('<ThreeColumns />', () => {

    it('renders single child in each column', () => {
        const testProps = {
            leftChildren: <div p={'1'}></div>,
            middleChildren: <div p={'2'}></div>,
            rightChildren: <div p={'3'}></div>
        };

        const wrapper = mount(<ThreeColumns {...testProps} />);
        const children = wrapper.children();
        const lChildWrapper = wrapper.childAt(0);
        const mChildWrapper = wrapper.childAt(1);
        const rChildWrapper = wrapper.childAt(2);

        expect(children.length).to.equal(3);

        expect(lChildWrapper.children().length).to.equal(1);
        expect(mChildWrapper.children().length).to.equal(1);
        expect(rChildWrapper.children().length).to.equal(1);

        expect(lChildWrapper.childAt(0).prop('p')).to.equal('1');
        expect(mChildWrapper.childAt(0).prop('p')).to.equal('2');
        expect(rChildWrapper.childAt(0).prop('p')).to.equal('3');
    });

    it('renders without any child in each column', () => {
        const testProps = {
        };

        const wrapper = mount(<ThreeColumns {...testProps} />);
        const children = wrapper.children();
        const lChildWrapper = wrapper.childAt(0);
        const mChildWrapper = wrapper.childAt(1);
        const rChildWrapper = wrapper.childAt(2);

        expect(children.length).to.equal(3);

        expect(lChildWrapper.children().length).to.equal(0);
        expect(mChildWrapper.children().length).to.equal(0);
        expect(rChildWrapper.children().length).to.equal(0);
    });

    it('renders multiple children in each column', () => {
        const testProps = {
            leftChildren: [<div key={'k11'} p={'11'}></div>, <div key={'k12'} p={'12'}></div>],
            middleChildren: [<div key={'k21'} p={'21'}></div>, <div key={'k22'} p={'22'}></div>, <div key={'k23'} p={'23'}></div>],
            rightChildren: [<div key={'k31'} p={'31'}></div>, <div key={'k32'} p={'32'}></div>]
        };

        const wrapper = mount(<ThreeColumns {...testProps} />);
        const children = wrapper.children();
        const lChildWrapper = wrapper.childAt(0);
        const mChildWrapper = wrapper.childAt(1);
        const rChildWrapper = wrapper.childAt(2);

        expect(children.length).to.equal(3);

        expect(lChildWrapper.children().length).to.equal(2);
        expect(mChildWrapper.children().length).to.equal(3);
        expect(rChildWrapper.children().length).to.equal(2);

        expect(lChildWrapper.childAt(0).prop('p')).to.equal('11');
        expect(lChildWrapper.childAt(1).prop('p')).to.equal('12');
        expect(mChildWrapper.childAt(0).prop('p')).to.equal('21');
        expect(mChildWrapper.childAt(1).prop('p')).to.equal('22');
        expect(mChildWrapper.childAt(2).prop('p')).to.equal('23');
        expect(rChildWrapper.childAt(0).prop('p')).to.equal('31');
        expect(rChildWrapper.childAt(1).prop('p')).to.equal('32');
    });

});
