/* globals sinon, expect, Promise */
import jsdom from 'jsdom';
import $ from 'jquery';
import React from 'react';
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

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions('kio', KioActions);
        this.createStore('kio', KioStore, this);

        this.createActions('mint', MintActions);
        this.createStore('mint', MintStore, this);

        this.createActions('essentials', EssentialsActions);
        this.createStore('essentials', EssentialsStore, this);
    }
}

class GlobalFlux extends Flummox {
    constructor() {
        super();

        this.createActions('user', UserActions);
        this.createStore('user', UserStore, this);
    }
}

describe('The access control form view', () => {
    var flux,
        globalFlux,
        actionSpy,
        $form,
        reactComponent,
        reactElement;

    function render(done) {
        let props = {
            flux: flux,
            globalFlux: globalFlux,
            applicationId: 'kio'
        };
        reactComponent = new AccessForm(props);
        reactElement = React.createElement(AccessForm, props);
        jsdom.env(React.renderToString(reactElement), (err, wndw) => {
            $form = $(wndw.document.body).find('.accessForm');
            done();
        });
    }

    beforeEach(done => {
        flux = new MockFlux();
        globalFlux = new GlobalFlux();
        flux.getStore('essentials').receiveScopes(['customer', [{ id: 'read_all' }]]);
        flux.getStore('mint').receiveOAuthConfig(['kio', MOCK_KIO]);
        actionSpy = sinon.stub(flux.getActions('mint'), 'saveOAuthConfig', () => {
            return Promise.resolve();
        });
        render(done);
    });

    it('should select the scope', () => {
        let items = $form.find('[data-block="scope-list-item"]');
        expect(items.length).to.equal(1);
        expect(items.find('input:checked').length).to.equal(1);
    });

    it('should show the bucket', () => {
        let items = $form.find('[data-block="editable-list-item"]');
        expect(items.length).to.equal(1);
        expect(items.first().text()).to.equal(MOCK_KIO.s3_buckets[0]);
    });

    it('should call the correct action', () => {
        reactComponent.save();
        expect(actionSpy.calledOnce).to.be.true;
    });
});