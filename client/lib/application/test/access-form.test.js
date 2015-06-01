/* globals sinon, expect, Promise */
import {Flummox} from 'flummox';
import KioStore from 'common/src/data/kio/kio-store';
import KioActions from 'common/src/data/kio/kio-actions';
import MintStore from 'common/src/data/mint/mint-store';
import MintActions from 'common/src/data/mint/mint-actions';
import EssentialsStore from 'common/src/data/essentials/essentials-store';
import EssentialsActions from 'common/src/data/essentials/essentials-actions';
import AccessForm from 'application/src/access-form/access-form';

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

describe('The access control form view', () => {
    var flux,
        actionSpy,
        form;

    beforeEach(() => {
        flux = new MockFlux();
        actionSpy = sinon.stub(flux.getActions('mint'), 'saveOAuthConfig', () => {
            return Promise.resolve();
        });
        form = new AccessForm({
            flux: flux,
            applicationId: 'kio'
        });
    });

    it('should show the placeholder when oauth is Pending', () => {
        flux.getStore('mint').beginFetchOAuthConfig('kio');
        expect(form.$el.children().first().hasClass('u-placeholder')).to.be.true;
    });

    it('should show the full view when oauth is completed', () => {
        flux.getStore('mint').receiveOAuthConfig(['kio', MOCK_KIO]);
        // not the placeholder
        expect(form.$el.children().first().hasClass('u-placeholder')).to.be.false;
    });

    it('should call the correct action', () => {
        flux.getStore('mint').receiveOAuthConfig(['kio', MOCK_KIO]);
        form.$el.find('form').submit();
        expect(actionSpy.calledOnce).to.be.true;
    });
});