// mock away redis so it doesn't try to connect
require('redis').createClient = () => ({
    on: () => {
    }
});

var sinon = require('sinon'),
    nmh = require('node-mocks-http'),
    mint = require('../../src/routes/mint'),
    data = require('../../src/data/mint'),
    redis = require('../../src/data/redis'),
    TEST_REQ = nmh.createRequest({
        method: 'GET',
        url: '/mintinfo',
        params: {
            apps: ['testApp']
        }
    });

describe('routes/mint', () => {

    it('should look in redis first', done => {
        var redisStub = sinon.stub(redis, 'getFaultyMintInfo'),
            mintStub = sinon.stub(data, 'app');
        // redis returns null
        redisStub.returns(Promise.resolve({}));

        // fake express response
        var response = nmh.createResponse({
            eventEmitter: require('events').EventEmitter
        });
        response.on('end', () => {
            // expect mint not to be called
            expect(mintStub.notCalled).to.be.true;
            // but redis once
            expect(redisStub.calledOnce).to.be.true;
            // with team "test"
            expect(redisStub.calledWith('testApp')).to.be.true;
            // reset
            redisStub.restore();
            mintStub.restore();
            done();
        });

        mint.faultyMintInfo(TEST_REQ, response);
    });

    it('should call app() of mint and redis.set if redis is empty', done => {
        var redisGetStub = sinon.stub(redis, 'getFaultyMintInfo'),
            redisSetStub = sinon.stub(redis, 'setFaultyMintInfo'),
            mintAppStub = sinon.stub(data, 'app'),
            APP = {
                'last_modified': '2016-02-08T17:34:28.860Z',
                'scopes': [],
                'is_client_confidential': true,
                'last_client_rotation': '2016-02-08T17:34:58.852Z',
                'username': 'stups_fullstop',
                'last_synced': '2016-02-08T17:34:56.048Z',
                'has_problems': true,
                'id': 'fullstop',
                'redirect_url': '',
                's3_errors': 0,
                's3_buckets': ['zalando-stups-mint-786011980701-eu-west-1'],
                'client_id': 'stups_fullstop_0bbe23f5-cf20-4f48-8b75-249b6474a3dc',
                'last_password_rotation': '2016-02-26T13:52:58.949Z',
                'message': ''
            },
            ANOTHER_APP = {
                'last_modified': '2016-02-08T17:34:28.860Z',
                'scopes': [],
                'is_client_confidential': true,
                'last_client_rotation': '2016-02-08T17:34:58.852Z',
                'username': 'stups_fullstop',
                'last_synced': '2016-02-08T17:34:56.048Z',
                'has_problems': true,
                'id': 'fullstop',
                'redirect_url': '',
                's3_errors': 0,
                's3_buckets': ['zalando-stups-mint-786011980701-eu-west-1'],
                'client_id': 'stups_fullstop_0bbe23f5-cf20-4f48-8b75-249b6474a3dc',
                'last_password_rotation': '2016-02-26T13:52:58.949Z',
                'message': ''
            };
        // redis returns nothing, so we would have to go to mint
        redisGetStub.returns(Promise.resolve(null));
        redisSetStub.returns(Promise.resolve([ANOTHER_APP])); // this does not matter
        mintAppStub.returns(Promise.resolve(APP));

        var response = nmh.createResponse({
            eventEmitter: require('events').EventEmitter
        });
        response.on('end', () => {
            // we should have called redis-get once
            expect(redisGetStub.calledOnce).to.be.true;
            // and also apps()
            expect(mintAppStub.calledOnce).to.be.true;
            // and we should have set the apps in redis too
            expect(redisSetStub.calledOnce).to.be.true;
            // check that we called it with correct objects
            expect(redisSetStub.calledWith('testApp', APP)).to.be.true;

            // reset
            redisGetStub.restore();
            redisSetStub.restore();
            mintAppStub.restore();

            done();
        });

        mint.faultyMintInfo(TEST_REQ, response);
    });
});
