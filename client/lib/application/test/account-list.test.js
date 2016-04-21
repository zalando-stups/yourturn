/* globals expect, $, TestUtils, reset, render, React */

import AccountList from 'application/src/application-list/account-list.jsx';

describe('The application team tab management', () => {
    beforeEach(() => {
        reset();
    });

    it('should select the appropriate elements', () => {
        const props = {
            selected: ['foo', 'bar'],
            accounts: ['foo', 'bazzzz', 'quux']
        };
        const list = render(AccountList, props);
        const selections = TestUtils.scryRenderedDOMComponentsWithClass(list, 'selected');
        expect(selections.length).to.equal(1);
    });

    it('should call the change function on update', (done) => {
        const props = {
            selected: [],
            accounts: ['foo', 'bar'],
            onChange: () => done()
        };
        const list = render(AccountList, props);
        const input = TestUtils.scryRenderedDOMComponentsWithAttributeValue(list, 'data-block', 'accountList-item-input')[0];
        input.checked = true;
        TestUtils.Simulate.change(input);
    });
});