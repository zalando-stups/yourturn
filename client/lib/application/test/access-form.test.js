/* globals expect, reset, render, sinon, Promise */
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
        props,
        form;

    beforeEach(done => {
        reset(() => {
            flux = new MockFlux();
            globalFlux = new GlobalFlux();
            flux.getStore('essentials').receiveScopes(['customer', [{
                id: 'read_all'
            }]]);
            flux.getStore('mint').receiveOAuthConfig(['kio', MOCK_KIO]);
            actionSpy = sinon.stub(flux.getActions('mint'), 'saveOAuthConfig', () => {
                return Promise.resolve();
            });
            props = {
                flux: flux,
                globalFlux: globalFlux,
                applicationId: 'kio'
            };
            form = render(AccessForm, props);
            done();
        });
    });

    it('should call the correct action', () => {
        form.save();
        expect(actionSpy.calledOnce).to.be.true;
    });
});