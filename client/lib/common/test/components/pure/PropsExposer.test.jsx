/* globals expect, sinon, React */

import PropsExposer from '../../../src/components/pure/PropsExposer.jsx'
import { shallow, mount } from 'enzyme';

describe('<PropsExposer />', () => {

    it('should call callbackFn after component did mount with all passed in props', () => {
        const testProps = {
            propA: 'valueA',
            porpB: () => {}
        };

        const callback = sinon.spy();

        const SomethingWrapped = PropsExposer(() => (<div />), callback);

        mount(<SomethingWrapped {...testProps} />);

        expect(callback.called).to.be.true;
        expect(callback.args[0][0]).to.eql(testProps);
    });

    it('should call callbackFn after props changed with all passed in props', () => {
        const testProps = {
            propA: 'valueA',
            porpB: () => {}
        };

        const testProps2 = {
            propA: 'valueB',
            porpB: () => {}
        };

        const callback = sinon.spy();

        const SomethingWrapped = PropsExposer(() => (<div />), callback);

        const wrapper = mount(<SomethingWrapped {...testProps} />);
        wrapper.setProps(testProps2);

        expect(callback.calledTwice).to.be.true;
        expect(callback.args[0][0]).to.eql(testProps);
        expect(callback.args[1][0]).to.eql(testProps2);
    });

    it('should pass all props down to wrapped component', () => {
        const testProps = {
            propA: 'valueA',
            porpB: () => {}
        };

        const callback = ()=> {};

        const SomethingWrapped = PropsExposer(() => (<div />), callback);

        const wrapper = shallow(<SomethingWrapped {...testProps} />);

        expect(wrapper.props()).to.eql(testProps);
    });
});
