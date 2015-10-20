/* globals expect, reset, render, sinon, Promise, TestUtils */
import {Flummox} from 'flummox';
import KioStore from 'common/src/data/kio/kio-store';
import KioActions from 'common/src/data/kio/kio-actions';
import MintStore from 'common/src/data/mint/mint-store';
import MintActions from 'common/src/data/mint/mint-actions';
import EssentialsStore from 'common/src/data/essentials/essentials-store';
import EssentialsActions from 'common/src/data/essentials/essentials-actions';
import UserStore from 'common/src/data/user/user-store';
import UserActions from 'common/src/data/user/user-actions';
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
    s3_buckets: [
    ],
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

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions('kio', KioActions);
        this.createStore('kio', KioStore, this);

        this.createActions('mint', MintActions);
        this.createStore('mint', MintStore, this);

        this.createActions('essentials', EssentialsActions);
        this.createStore('essentials', EssentialsStore, this);

        this.createActions('user', UserActions);
        this.createStore('user', UserStore, this);
    }
}

describe('The access control form view', () => {
    var flux,
        actionSpy,
        props,
        form;

    beforeEach(() => {
        reset();
        flux = new MockFlux();
        flux.getStore('essentials').receiveScopes(['customer', [{
            id: 'read_all'
        }]]);
        flux.getStore('mint').receiveOAuthConfig(['kio', OAUTH_KIO]);
        flux.getStore('kio').receiveApplication(APP_KIO);
        flux.getStore('user').receiveAccounts(ACCOUNTS);
        actionSpy = sinon.stub(flux.getActions('mint'), 'saveOAuthConfig', () => {
            return Promise.resolve();
        });

        props = {
            applicationId: 'kio',
            kioStore: flux.getStore('kio'),
            essentialsStore: flux.getStore('essentials'),
            userStore: flux.getStore('user'),
            mintStore: flux.getStore('mint'),
            mintActions: flux.getActions('mint')
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