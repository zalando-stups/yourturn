/* globals expect, $, TestUtils, reset, render, React, Promise, sinon */
import KioStore from 'common/src/data/kio/kio-store';
import KioTypes from 'common/src/data/kio/kio-types';
import * as KioGetter from 'common/src/data/kio/kio-getter';
import * as KioActions from 'common/src/data/kio/kio-actions';

import MintStore from 'common/src/data/mint/mint-store';
import * as MintActions from 'common/src/data/mint/mint-actions';
import * as MintGetter from 'common/src/data/mint/mint-getter';
import MintTypes from 'common/src/data/mint/mint-types';

import EssentialsStore from 'common/src/data/essentials/essentials-store';
import * as EssentialsGetter from 'common/src/data/essentials/essentials-getter';

import UserStore from 'common/src/data/user/user-store';
import UserTypes from 'common/src/data/user/user-types';
import * as UserGetter from 'common/src/data/user/user-getter';

import OAuthForm from 'application/src/oauth-form/oauth-form.jsx';
import {bindGettersToState} from 'common/src/util';

const MOCK_KIO = {
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

        let mintActions = Object.assign({}, MintActions),
            kioState = KioStore(),
            essentialsState = EssentialsStore(),
            mintState = MintStore(MintStore(), {
                type: MintTypes.FETCH_OAUTH_CONFIG,
                payload: ['kio', MOCK_KIO]
            }),
            userState = UserStore();

        actionSpy = sinon.stub(mintActions, 'saveOAuthConfig', () => {
            return Promise.resolve();
        });
        props = {
            applicationId: 'kio',
            mintActions,
            kioStore: bindGettersToState(kioState, KioGetter),
            userStore: bindGettersToState(userState, UserGetter),
            mintStore: bindGettersToState(mintState, MintGetter),
            essentialsStore: bindGettersToState(essentialsState, EssentialsGetter)
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