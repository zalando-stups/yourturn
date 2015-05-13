/* globals sinon, Promise, expect */
import {Flummox} from 'flummox';
import ApplicationStore from 'common/src/data/application/application-store';
import ApplicationActions from 'common/src/data/application/application-actions';
import OAuthStore from 'common/src/data/oauth/oauth-store';
import OAuthActions from 'common/src/data/oauth/oauth-actions';
import ResourceStore from 'common/src/data/resource/resource-store';
import ResourceActions from 'common/src/data/resource/resource-actions';
import OAuthForm from 'application/src/oauth-form/oauth-form';

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

        this.createActions('application', ApplicationActions);
        this.createStore('application', ApplicationStore, this);

        this.createActions('oauth', OAuthActions);
        this.createStore('oauth', OAuthStore, this);

        this.createActions('resource', ResourceActions);
        this.createStore('resource', ResourceStore, this);
    }
}

describe('The oauth form view', () => {
    var flux,
        actionSpy,
        form;

    beforeEach(() => {
        flux = new MockFlux();
        actionSpy = sinon.stub(flux.getActions('oauth'), 'saveOAuthConfig', () => {
            return Promise.resolve();
        });
        form = new OAuthForm({
            flux: flux,
            applicationId: 'kio'
        });
    });

    it('should show the placeholder when oauth is Pending', () => {
        flux.getStore('oauth').beginFetchOAuthConfig('kio');
        expect(form.$el.children().first().hasClass('u-placeholder')).to.be.true;
    });

    it('should show the full view when oauth is completed', () => {
        flux.getStore('oauth').receiveOAuthConfig(['kio', MOCK_KIO]);
        // not the placeholder
        expect(form.$el.children().first().hasClass('u-placeholder')).to.be.false;
    });

    it('should check the non-confidentiality checkbox by default', () => {
        flux.getStore('oauth').receiveOAuthConfig(['kio', MOCK_KIO]);
        let $box = form.$el.find('[data-block="confidentiality-checkbox"]').first();
        expect($box.is(':checked')).to.be.true;
    });

    it('should call the correct action', () => {
        flux.getStore('oauth').receiveOAuthConfig(['kio', MOCK_KIO]);
        form.$el.find('form').submit();
        expect(actionSpy.calledOnce).to.be.true;
    });
});