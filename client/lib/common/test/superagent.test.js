import request from 'common/src/superagent';
import {Provider} from 'common/src/oauth';

describe('superagent', () => {

    it('#exec() should return a promise', () => {
        let req = request
                    .get('some.whe.re')
                    .exec();
        expect( req instanceof Promise ).to.be.true;
        return req.should.be.rejected;
    });

    it('#oauth() should enable oauth', () => {
        let provider = new Provider({
            id: 'test',
            authorization_url: 'adsf'
        });
        let req = request
                    .get('some.wh.at')
                    .oauth( provider );

        expect(req._oauthProvider).to.equal(provider);
        expect(req._oauthEnabled).to.be.true;
    });

    it('#oauth() should use an available access token', (done) => {
        let provider = new Provider({
            id: 'test',
            authorization_url: 'test'
        });
        provider.setToken('token');

        let req = request
                    .get('testlocation')
                    .oauth(provider);

        req.end = function() {
            //TODO this is quite implementation-specific :(
            expect( this._header.authorization ).to.equal('Token token');
            done();
        };

        req.exec();
    });
});