import querystring from 'querystring';
import _ from 'lodash';
import {
    Provider,
    Request,
    ImplicitRequest,
    Response,
    LocalTokenStorage
} from 'common/src/oauth';

describe('OAuth2', () => {
    describe('Provider', () => {
        it('should bail without authorization_url', () => {
            expect(() => new Provider({
                            id: true
                        })).to.throw;
        });

        it('should bail without id', () => {
            expect(() => new Provider({
                            authorization_url: true
                        })).to.throw;
        });

        it('should not have a trailing slash on the auth url', () => {
            let provider = new Provider({
                id: 'test',
                authorization_url: 'auth/'
            });
            let lastCharacter = provider.authorization_url[provider.authorization_url.length - 1];
            expect(lastCharacter).to.equal('h');
        });

        it('should have a trailing slash on the auth url if it is in the query', () => {
            let provider = new Provider({
                id: 'test',
                authorization_url: 'some.url?auth/'
            });
            let lastCharacter = provider.authorization_url[provider.authorization_url.length - 1];
            expect(lastCharacter).to.equal('/');
        });

        it('should have an instance of LocalTokenStorage by default', () => {
            let provider = new Provider({
                id: 'test',
                authorization_url: 'auth'
            });
            expect( provider.store ).to.not.be.undefined;
            expect( provider.store instanceof LocalTokenStorage ).to.be.true;
            expect( provider.store.prefix ).to.equal(provider.id);
        });

        it('should uri encode an implicit request', () => {
            let provider = new Provider({
                id: 'test',
                authorization_url: 'auth'
            });
            let config = {
                client_id: 'client',
                redirect_uri: 'http://localhost:8080/auth',
                scope: 'email user'
            };
            let encoded = provider.encodeInUri(new ImplicitRequest(config));
            expect(encoded.startsWith('auth')).to.be.true;
            let query = encoded.substring(6);
            let parsed = querystring.parse(query);
            expect(parsed.client_id).to.equal(config.client_id);
            expect(parsed.redirect_uri).to.equal(config.redirect_uri);
            expect(parsed.scope).to.equal(config.scope);
            expect(parsed.state).to.not.be.undefined;
        });
    });

    describe('Request', () => {
        it('should bail without response_type', () => {
            expect(() => new Request()).to.throw;
        });
    });

    describe('ImplicitRequest', () => {
        it('should bail without client_id', () => {
            expect(() => new ImplicitRequest()).to.throw;
        });

        it('should have a random state', () => {
            let req = new ImplicitRequest({
                client_id: 'client'
            });
            expect(req.state).to.not.be.undefined;
            expect(typeof req.state).to.equal('string');
        });
    });

    describe('LocalTokenStorage', () => {
        it('should bail without prefix', () => {
            expect(() => new LocalTokenStorage()).to.throw;
        });
    });

    describe('Response', () => {
        it('should bail without access_token', () => {
            expect(() => new Response({
                token_type: true,
                state: true
            })).to.throw;
        });

        it('should bail without token_type', () => {
            expect(() => new Response({
                access_token: true,
                state: true
            })).to.throw;
        });
    });
});