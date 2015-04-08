import {
    Provider,
    Request,
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

        it('should have an instance of LocalTokenStorage by default', () => {
            let provider = new Provider({
                id: 'test',
                authorization_url: true
            });
            expect( provider.store ).to.not.be.undefined;
            expect( provider.store instanceof LocalTokenStorage ).to.be.true;
            expect( provider.store.prefix ).to.equal(provider.id);
        });
    });

    describe('Request', () => {
        it('should bail without client_id', () => {
            expect(() => new Request()).to.throw;
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

        it('should bail without state', () => {
            expect(() => new Response({
                token_type: true,
                access_token: true
            })).to.throw;
        });
    });
});