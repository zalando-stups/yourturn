'use strict';

const sinon = require('sinon');
const redis = require('redis');
const moment = require('moment');
const bluebird = require('bluebird');

const stores = require('../../../src/data/stores/distinct');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('stores/distinct', () => {
    describe('in-memory', () => {
        describe('#add', () => {
            it('should add any item', () => {
                const store = stores.inMemoryStore({
                    keyExpiration: null
                });

                return Promise.all([
                    store.add(42),
                    store.add('foo'),
                    store.add({ key: 'value' })
                ]);
            });
        });

        describe('#size', () => {
            it('should return 0 if no items where added', () => {
                const store = stores.inMemoryStore();

                return store.size.then(size => {
                    expect(size).to.equal(0);
                });
            });

            it('should return count of all items if there are no expiration', () => {
                const store = stores.inMemoryStore({
                    keyExpiration: null
                });

                return Promise.all([store.add(42), store.add('foo')])
                    .then(() => store.size)
                    .then(size => {
                        expect(size).to.equal(2);
                    });
            });

            it('should return count of all non-expired items', () => {
                const store = stores.inMemoryStore({
                    keyExpiration: moment.duration(100, 'ms')
                });

                return store.add(42)
                    .then(() => delay(150))
                    .then(() => store.add('foo'))
                    .then(() => store.size)
                    .then(size => {
                        expect(size).to.equal(1);
                    });
            });

            it('should return 0 if all items have expired', () => {
                const store = stores.inMemoryStore({
                    keyExpiration: moment.duration(100, 'ms')
                });

                return store.add(42)
                    .then(() => store.add('foo'))
                    .then(() => delay(150))
                    .then(() => store.size)
                    .then(size => {
                        expect(size).to.equal(0);
                    });
            });
        });

        describe('#items', () => {
            it('should return empty array if no items were added', () => {
                const store = stores.inMemoryStore();

                return store.items.then(items => {
                    expect(items).to.be.empty;
                });
            });

            it('should return all items if there are no expiration', () => {
                const store = stores.inMemoryStore({
                    keyExpiration: null
                });

                return Promise.all([
                    store.add(42),
                    store.add('foo')
                ])
                    .then(() => store.items)
                    .then(items => {
                        expect(items).to.have.members([42, 'foo']);
                    });
            });

            it('should return all non-expirated items', () => {
                const store = stores.inMemoryStore({
                    keyExpiration: moment.duration(100, 'ms')
                });

                return store.add(42)
                    .then(() => delay(150))
                    .then(() => store.add('foo'))
                    .then(() => store.items)
                    .then(items => {
                        expect(items).to.have.members(['foo']);
                    });
            });

            it('should return empty array if all items have expired', () => {
                const store = stores.inMemoryStore({
                    keyExpiration: moment.duration(100, 'ms')
                });

                return store.add(42)
                    .then(() => store.add('foo'))
                    .then(() => delay(150))
                    .then(() => store.items)
                    .then(items => {
                        expect(items).to.be.empty;
                    });
            });
        });
    });

    // First I've started with sinon stubs and all that stuff, but ended
    // up mocking entire responses which is stupid and have no relation
    // to code under test
    describe('redis', () => {
        let redisClient;

        before(() => {
            bluebird.promisifyAll(redis.RedisClient.prototype);
            bluebird.promisifyAll(redis.Multi.prototype);
        });

        beforeEach(() => {
            redisClient = sinon.createStubInstance(redis.RedisClient);
            redisClient.multi
                .withArgs()
                .returnsThis();
        });

        describe('#items', () => {
            it('should store encoded and return decoded items', () => {
                const store = stores.redisStore({
                    redis: redisClient,
                    keyExpiration: null
                });

                const first = 42;
                const second = '42';
                const third = { key: 'value' };

                redisClient.zaddAsync
                    .withArgs('distinct-items', sinon.match.number, JSON.stringify(first))
                    .returns(Promise.resolve())
                    .withArgs('distinct-items', sinon.match.number, JSON.stringify(second))
                    .returns(Promise.resolve())
                    .withArgs('distinct-items', sinon.match.number, JSON.stringify(third))
                    .returns(Promise.resolve());
                redisClient.zrange
                    .withArgs('distinct-items', 0, -1)
                    .returnsThis();
                redisClient.execAsync
                    .returns(Promise.resolve([0, [
                        JSON.stringify(first),
                        JSON.stringify(second),
                        JSON.stringify(third)
                    ]]));

                return Promise.all([
                    store.add(first),
                    store.add(second),
                    store.add(third)
                ])
                    .then(() => store.items)
                    .then(items => {
                        expect(items).to.eql([42, '42', { key: 'value' }]);
                    });
            });
        });
    });

    describe('with-fallback', () => {
        describe('#add', () => {
            it('should add items to main store first', () => {
                const main = stores.inMemoryStore();
                const fallback = stores.inMemoryStore();

                const store = stores.storeWithFallback(main, fallback);

                return store.add(42)
                    .then(() => Promise.all([
                        store.items,
                        main.items,
                        fallback.items
                    ]))
                    .then(res => {
                        const storeItems = res[0];
                        const mainItems = res[1];
                        const fallbackItems = res[2];

                        expect(storeItems).to.have.members([42]);
                        expect(mainItems).to.have.members([42]);
                        expect(fallbackItems).to.be.empty;
                    });
            });

            it('should add items to fallback store if main store fails', () => {
                const main = Object.create(stores.inMemoryStore());
                const fallback = stores.inMemoryStore();

                const store = stores.storeWithFallback(main, fallback);

                sinon.stub(main, 'add').returns(Promise.reject());

                return store.add(42)
                    .then(() => Promise.all([
                        store.items,
                        main.items,
                        fallback.items
                    ]))
                    .then(res => {
                        const storeItems = res[0];
                        const mainItems = res[1];
                        const fallbackItems = res[2];

                        expect(storeItems).to.be.empty;
                        expect(mainItems).to.be.empty;
                        expect(fallbackItems).to.have.members([42]);
                    })
            });

            it('should add items to main store from fallback store when main'
                + ' is avaliable again', () => {
                const main = stores.inMemoryStore();
                const fallback = stores.inMemoryStore();

                const store = stores.storeWithFallback(main, fallback);

                sinon.stub(main, 'add').returns(Promise.reject());

                return Promise.all([store.add(42), store.add('foo')])
                    .then(() => {
                        main.add.restore();
                        return store.add('bar');
                    })
                    .then(() => Promise.all([
                        store.items,
                        main.items,
                        fallback.items
                    ]))
                    .then(res => {
                        const storeItems = res[0];
                        const mainItems = res[1];
                        const fallbackItems = res[2];

                        expect(storeItems).to.have.members([42, 'foo', 'bar']);
                        expect(mainItems).to.have.members([42, 'foo', 'bar']);
                        expect(fallbackItems).to.have.members([42, 'foo']);
                    });
            });

            it('would reject with both stores errors if they fail', () => {
                const main = stores.inMemoryStore();
                const fallback = stores.inMemoryStore();

                const store = stores.storeWithFallback(main, fallback)

                sinon.stub(main, 'add')
                    .returns(Promise.reject(new Error('main error')));
                sinon.stub(fallback, 'add')
                    .returns(Promise.reject(new Error('fallback error')));

                return store.add(42)
                    .catch(res => {
                        const mainError = res[0];
                        const fallbackError = res[1];

                        expect(mainError).to.be.an('error');
                        expect(mainError.message).to.equal('main error');
                        expect(fallbackError).to.be.an('error');
                        expect(fallbackError.message).to.equal('fallback error');
                    });
            });
        });
    });
});
