/* globals expect, $, TestUtils, reset, render, React, Promise, sinon */
import * as MintActions from 'common/src/data/mint/mint-actions';
import OAuthForm from 'application/src/oauth-form/oauth-form.jsx';

const TEST_APP = {
    id: 'kio',
    name: 'Kio'
},
TEST_OAUTH = {
    id: 'kio',
    username: 'kio-robot',
    last_password_rotation: '2015-01-01T12:42:41Z',
    last_client_rotation: '2015-01-01T12:42:41Z',
    last_modified: '2015-01-01T12:42:41Z',
    last_synced: '2015-01-01T12:42:41Z',
    has_problems: false,
    redirect_url: 'http://example.com/oauth',
    s3_buckets: [
        'kio-stups-bucket'
    ],
    scopes: [{
        resource_type_id: 'customer',
        scope_id: 'read_all'
    }]
};

describe('The oauth form view', () => {
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
            application: TEST_APP,
            allScopes: [],
            resourceOwnerScopes: [],
            oauthConfig: TEST_OAUTH,
            editable: true
        };

        form = render(OAuthForm, props);
    });

    it('should check the non-confidentiality checkbox by default', () => {
        let box = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'confidentiality-checkbox');
        expect($(React.findDOMNode(box)).is(':checked')).to.be.true;
    });

    it('should call the correct action', () => {
        let f = TestUtils.findRenderedDOMComponentWithAttributeValue(form, 'data-block', 'form');
        TestUtils.Simulate.submit(f);
        expect(actionSpy.calledOnce).to.be.true;
    });
});
