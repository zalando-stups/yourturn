/* globals expect, reset, render, sinon, Promise, TestUtils */
import KioStore from 'common/src/data/kio/kio-store';
import KioTypes from 'common/src/data/kio/kio-types';
import * as KioGetter from 'common/src/data/kio/kio-getter';

import MintStore from 'common/src/data/mint/mint-store';
import * as MintActions from 'common/src/data/mint/mint-actions';
import * as MintGetter from 'common/src/data/mint/mint-getter';
import MintTypes from 'common/src/data/mint/mint-types';

import EssentialsStore from 'common/src/data/essentials/essentials-store';
import * as EssentialsGetter from 'common/src/data/essentials/essentials-getter';

import UserStore from 'common/src/data/user/user-store';
import * as UserGetter from 'common/src/data/user/user-getter';
import UserTypes from 'common/src/data/user/user-types';

import AccessForm from 'application/src/access-form/access-form.jsx';
import {bindGettersToState} from 'common/src/util';

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
},
ACCOUNTS = [{
    id: '123',
    name: 'stups'
}];

describe('The access control form view', () => {
    var actionSpy,
        props,
        form;

    beforeEach(() => {
        reset();

        let kioState = KioStore(KioStore(), {
                type: KioTypes.FETCH_APPLICATION,
                payload: APP_KIO
            }),
            essentialsState = EssentialsStore(),
            userState = UserStore(UserStore(), {
                type: UserTypes.FETCH_USERACCOUNTS,
                payload: ACCOUNTS
            }),
            mintState = MintStore(MintStore(), {
                type: MintTypes.FETCH_OAUTH_CONFIG,
                payload: ['kio', OAUTH_KIO]
            }),
            mintActions = Object.assign({}, MintActions);

        actionSpy = sinon.stub(mintActions, 'saveOAuthConfig', () => {
            return Promise.resolve();
        });

        props = {
            applicationId: 'kio',
            kioStore: bindGettersToState(kioState, KioGetter),
            essentialsStore: bindGettersToState(essentialsState, EssentialsGetter),
            userStore: bindGettersToState(userState, UserGetter),
            mintStore: bindGettersToState(mintState, MintGetter),
            mintActions
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