/* globals expect, $, TestUtils, reset, render, React */
import EssentialsStore from 'common/src/data/essentials/essentials-store';
import EssentialsTypes from 'common/src/data/essentials/essentials-types';
import * as EssentialsGetter from 'common/src/data/essentials/essentials-getter';

import Form from 'resource/src/scope-form/scope-form.jsx';
import {bindGettersToState} from 'common/src/util';

const RES_ID = 'sales_order';

describe('The scope form view', () => {
    var props,
        form;

    describe('in create mode', () => {
        beforeEach(() => {
            reset();

            props = {
                essentialsStore: bindGettersToState(EssentialsStore(), EssentialsGetter)
            };
            form = render(Form, props);
        });

        it('should have application checkbox preselected', () => {
            let checkbox = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'appscope-checkbox');
            expect($(React.findDOMNode(checkbox)).is(':checked')).to.be.true;
        });
    });
});
