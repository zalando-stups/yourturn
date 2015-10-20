/* globals expect, $, TestUtils, reset, render, React */
import {Flummox} from 'flummox';
import EssentialsStore from 'common/src/data/essentials/essentials-store';
import EssentialsActions from 'common/src/data/essentials/essentials-actions';
import UserStore from 'common/src/data/user/user-store';
import UserActions from 'common/src/data/user/user-actions';
import Detail from 'resource/src/scope-detail/scope-detail.jsx';

const RES_ID = 'sales_order',
        SCP_ID = 'read',
        TEST_SCP = {
            id: 'read',
            is_resource_owner_scope: true,
            description: '# Read scope'
        },
        TEST_APP = {
            'id': 'kio'
        };

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions('essentials', EssentialsActions);
        this.createStore('essentials', EssentialsStore, this);

        this.createActions('user', UserActions);
        this.createStore('user', UserStore, this);
    }
}

describe('The scope detail view', () => {
    var flux,
        props,
        detail;

    beforeEach(() => {
        reset();
        flux = new MockFlux();
        props = {
            resourceId: RES_ID,
            scopeId: SCP_ID,
            essentialsStore: flux.getStore('essentials'),
            userStore: flux.getStore('user')
        };
        flux.getStore('essentials').receiveScope([RES_ID, TEST_SCP]);
        flux.getStore('essentials').receiveScopeApplications([RES_ID, SCP_ID, [TEST_APP]]);
        detail = render(Detail, props);
    });

    it('should contain rendered markdown', () => {
        let description = TestUtils.findRenderedDOMComponentWithAttributeValue(detail, 'data-block', 'description');
        expect($(React.findDOMNode(description)).find('h1').length).to.equal(1);
    });

    it('should display applications using the scope', () => {
        expect(() => TestUtils.findRenderedDOMComponentWithAttributeValue(detail, 'data-block', 'app-list'))
            .to.not.throw;
    });
});
