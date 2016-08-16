/* globals expect, reset, render, sinon, Promise, TestUtils */
import * as MintActions from 'common/src/data/mint/mint-actions';
import AccessForm from 'application/src/access-form/access-form.jsx';

const OAUTH_KIO = {
    id: 'kio',
    username: 'kio-robot',
    last_password_rotation: '2015-01-01T12:42:41Z',
    last_client_rotation: '2015-01-01T12:42:41Z',
    last_modified: '2015-01-01T12:42:41Z',
    last_synced: '2015-01-01T12:42:41Z',
    has_problems: false,
    redirect_url: 'http://example.com/oauth',
    s3_buckets: [],
    scopes: [{
        resource_type_id: 'customer',
        scope_id: 'read_all'
    }]
},
APP_KIO = {
    id: 'kio',
    team_id: 'stups',
    active: true
};

describe('The access control form view', () => {
    var actionSpy,
        props,
        form;

    beforeEach(() => {
        reset();

        let mintActions = Object.assign({}, MintActions);
        actionSpy = sinon.stub(mintActions, 'saveOAuthConfig', () => {
            return Promise.resolve();
        });

        props = {
            applicationId: 'kio',
            mintActions,
            application: APP_KIO,
            allScopes: [],
            applicationScopes: [],
            oauthConfig: OAUTH_KIO,
            defaultAccount: 'foo',
            editable: true,
            notificationActions: {}
        };
        form = render(AccessForm, props);
    });

    it('should call the correct action', () => {
        let f = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'form');
        TestUtils.Simulate.submit(f);
        expect(actionSpy.calledOnce).to.be.true;
    });

    it('should suggest a mint bucket', () => {
        TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'mint-bucket-suggestion');
    });

    it('should add suggested bucket to list', () => {
        expect(() => {
            TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'editable-list-item');
        }).to.throw;
        let btn = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'mint-bucket-add-suggestion');
        TestUtils.Simulate.click(btn);
        TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'editable-list-item');
    });

    it('should not suggest after adding', () => {
        let btn = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'mint-bucket-add-suggestion');
        TestUtils.Simulate.click(btn);
        expect(() => {
            TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'mint-bucket-suggestion');
        }).to.throw;
    });
});
