// mock away redis so it doesn't try to connect
require('redis').createClient = () => ({
    on: () => {}
});

var sinon = require('sinon'),
    nmh = require('node-mocks-http'),
    kio = require('../../src/routes/kio'),
    data = require('../../src/data/kio'),
    redis = require('../../src/data/redis'),
    TEST_REQ = nmh.createRequest({
        method: 'GET',
        url: '/latestVersions/test',
        params: {
            team: 'test'
        }
    });

describe('routes/kio', () => {

    it('should look in redis first', done => {
        var redisStub = sinon.stub(redis, 'getLatestVersions'),
            kioStub = sinon.stub(data, 'apps');
        // redis returns an empty array of versions
        redisStub.returns(Promise.resolve([]));

        // fake express response
        var response = nmh.createResponse({
            eventEmitter: require('events').EventEmitter
        });
        response.on('end', () => {
            // expect kio not to be called
            expect(kioStub.notCalled).to.be.true;
            // but redis once
            expect(redisStub.calledOnce).to.be.true;
            // with team "test"
            expect(redisStub.calledWith('test')).to.be.true;
            // reset
            redisStub.restore();
            kioStub.restore();
            done();
        });

        kio.latestVersions(TEST_REQ, response);
    });

    it('should call apps() of kio and redis.set if redis is empty', done => {
        var redisGetStub = sinon.stub(redis, 'getLatestVersions'),
            redisSetStub = sinon.stub(redis, 'setLatestVersions')
            kioVerStub = sinon.stub(data, 'versions'),
            kioAppStub = sinon.stub(data, 'apps'),
            APP = [{
                id: 'test-app',
                team_id: 'test'
            }, {
                id: 'kio',
                team_id: 'test'
            }],
            S_VERS = [{
                id: 'cd1',
                application_id: 'kio',
                last_modified: '2015-12-08T15:30:00.000Z'
            }, {
                id: 'cd2',
                application_id: 'kio',
                last_modified: '2015-10-05T10:30:00.000Z'
            }],
            T_VERS = [{
                id: 'alpha',
                application_id: 'test-app',
                last_modified: '2015-12-08T15:30:00.000Z'
            }, {
                id: 'beta',
                application_id: 'test-app',
                last_modified: '2015-10-05T10:30:00.000Z'
            }];
        // redis returns nothing, so we would have to go to kio
        redisGetStub.returns(Promise.resolve(null));
        redisSetStub.returns(Promise.resolve([T_VERS[0]])); // this does not matter
        kioAppStub.returns(Promise.resolve(APP));
        kioVerStub
            .onCall(0)  // test-app
            .returns(Promise.resolve(T_VERS));
        kioVerStub
            .onCall(1)  // kio
            .returns(Promise.resolve(S_VERS));

        var response = nmh.createResponse({
            eventEmitter: require('events').EventEmitter
        });
        response.on('end', () => {
            // we should have called redis-get once
            expect(redisGetStub.calledOnce).to.be.true;
            // and also apps()
            expect(kioAppStub.calledOnce).to.be.true;
            // and versions as often as we have apps
            expect(kioVerStub.callCount).to.equal(APP.length);
            // and we should have set the versions in redis too
            expect(redisSetStub.calledOnce).to.be.true;
            // check that we called it with correct objects
            var processedAlpha = Object.assign({}, T_VERS[0]),
                processedCd1 = Object.assign({}, S_VERS[0]);
            processedCd1.timestamp = new Date(processedCd1.last_modified).getTime();
            processedAlpha.timestamp = new Date(processedAlpha.last_modified).getTime();
            expect(redisSetStub.calledWith('test', [
                processedAlpha,
                processedCd1
            ])).to.be.true;

            // reset
            redisGetStub.restore();
            redisSetStub.restore();
            kioVerStub.restore();
            kioAppStub.restore();

            done();
        });

        kio.latestVersions(TEST_REQ, response);
    });
});
