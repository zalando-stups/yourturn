import querystring from 'querystring';
import _ from 'lodash';
import {
    Provider,
    Request,
    ImplicitRequest,
    Response,
    ImplicitResponse,
    ErrorResponse,
    LocalTokenStorage
} from 'common/src/oauth';

describe('OAuth2', () => {
    describe('Provider', () => {
        var provider,
            requestConfig,
            responseConfig,
            request;

        beforeEach(() => {
            provider = new Provider({
                id: 'test',
                authorization_url: 'auth'
            });
            requestConfig = {
                client_id: 'client',
                redirect_uri: 'http://localhost:8080/auth',
                scope: 'email user'
            };
            responseConfig = {
                token_type: 'access',
                access_token: 'access_token',
                refresh_token: 'refresh_token'
            };
            request = new ImplicitRequest(requestConfig);
        });

        afterEach(() => {
            provider.store._empty();
        });

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
            provider = new Provider({
                id: 'test',
                authorization_url: 'auth/'
            });
            let lastCharacter = provider.authorization_url[provider.authorization_url.length - 1];
            expect(lastCharacter).to.equal('h');
        });

        it('should have a trailing slash on the auth url if it is in the query', () => {
            provider = new Provider({
                id: 'test',
                authorization_url: 'some.url?auth/'
            });
            let lastCharacter = provider.authorization_url[provider.authorization_url.length - 1];
            expect(lastCharacter).to.equal('/');
        });

        it('should have an instance of LocalTokenStorage by default', () => {
            expect( provider.store ).to.not.be.undefined;
            expect( provider.store instanceof LocalTokenStorage ).to.be.true;
            expect( provider.store.prefix ).to.equal(provider.id);
        });

        it('should uri encode an implicit request', () => {
            let encoded = provider.encodeInUri(request);
            expect(encoded.startsWith('auth')).to.be.true;
            let query = encoded.substring(6);
            let parsed = querystring.parse(query);
            expect(parsed.client_id).to.equal(requestConfig.client_id);
            expect(parsed.redirect_uri).to.equal(requestConfig.redirect_uri);
            expect(parsed.scope).to.equal(requestConfig.scope);
            expect(parsed.state).to.not.be.undefined;
        });

        it('should uri decode a success uri fragment', () => {
            responseConfig.state = request.state;
            let fragment = querystring.stringify(responseConfig);
            let decoded = provider.decodeFromUri(fragment);
            // should not be an error
            expect(decoded instanceof ImplicitResponse).to.be.true;
            expect(responseConfig.state).to.equal(decoded.state);
            expect(responseConfig.access_token).to.equal(decoded.access_token);
            expect(responseConfig.refresh_token).to.equal(decoded.refresh_token);
            expect(responseConfig.token_type).to.equal(decoded.token_type);
        });

        it('should uri decode an error fragment', () => {
            let fragment = querystring.stringify({
                error: 'access_denied',
                state: request.state
            });
            let decoded = provider.decodeFromUri(fragment);
            expect(decoded instanceof ErrorResponse).to.be.true;
        });

        it('#parse should throw without an url fragment', () => {
            expect( () => provider.parse() ).to.throw;
            expect( () => provider.parse('') ).to.throw;
            expect( () => provider.parse(true)).to.throw;
        });

        it('should remember a request', () => {
            provider.remember(request);
            expect(provider.store.get(request.state)).to.be.ok;
        });

        it('should forget a request', () => {
            provider.remember(request);
            provider.forget(request);
            expect(provider.store.get(request.state)).to.not.be.ok;
        });

        it('should expect a response after remembering the request', () => {
            provider.remember(request);
            expect(provider.isExpected({
                state: request.state
            })).to.be.true;
        });

        it('should not expect if the state differs', () => {
            provider.remember(request);
            expect(provider.isExpected({
                state: '123123'
            })).to.be.false;
        });

        it('#parse should return the response and save tokens', () => {
            provider.remember(request);
            responseConfig.state = request.state;
            let fragment = querystring.stringify(responseConfig);
            let response = provider.parse(fragment);

            // should not be an error
            expect(response instanceof ErrorResponse).to.be.false;
            expect(response instanceof ImplicitResponse).to.be.true;
            // should have saved access and request tokens
            expect(provider.getAccessToken()).to.equal(response.access_token);
            expect(provider.getRefreshToken()).to.equal(response.refresh_token);
        });

        it('#parse should return the error response', () => {
            provider.remember(request);
            let fragment = querystring.stringify({
                error: 'access_denied',
                state: request.state
            });
            let response = provider.parse(fragment);

            expect(response instanceof ErrorResponse).to.be.true;

            // there should not be any tokens
            expect(provider.getAccessToken()).to.not.be.ok;
            expect(provider.getRefreshToken()).to.not.be.ok;
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