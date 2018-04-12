/* globals expect, TestUtils, render */
import Immutable from 'immutable';
import FoldedScopeList from 'application/src/folded-scope-list.jsx';

describe('Folded scope list tests', () => {

    it.skip('should create a component', () => {
        const props = {
            selected: [],
            scopes: Immutable.Map(),
            onFold: () => {},
            allResources: Immutable.Map()
        };
        const list = render(FoldedScopeList, props);
        const selections = TestUtils.scryRenderedDOMComponentsWithClass(list, 'selected');
        expect(selections.length).to.equal(1);
    });

    it.skip('should call the change function on update', (done) => {
        const props = {
            selected: [],
            accounts: ['foo', 'bar'],
            onChange: () => done()
        };
        const list = render(FoldedScopeList, props);
        const input = TestUtils.scryRenderedDOMComponentsWithAttributeValue(list, 'data-block', 'accountList-item-input')[0];
        input.checked = true;
        TestUtils.Simulate.change(input);
    });
});