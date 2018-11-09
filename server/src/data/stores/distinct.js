'use strict';

const bluebird = require('bluebird');
const moment = require('moment');
const winston = require('winston');

const DEFAULT_EXPIRATION_TIME = moment.duration(1, 'week');
const lastElement = arr => arr[arr.length - 1];

const inMemoryStore = (options) => {
    let keyExpiration = (options || {}).keyExpiration;
    if (keyExpiration === undefined) {
        keyExpiration = DEFAULT_EXPIRATION_TIME;
    }

    const store = new Map();

    const cleanup = () => {
        if (!keyExpiration) {
            return;
        }
        const keysExpirationTime = moment().subtract(keyExpiration);
        [...store.keys()].forEach(key => {
            const keyAdditionTime = store.get(key);
            if (keyAdditionTime < keysExpirationTime) {
                store.delete(key);
            }
        });
    };

    // TODO: find a way to use freeze here and not break tests
    return Object.seal({
        add(item) {
            store.set(item, moment());
            return Promise.resolve();
        },
        get size() {
            cleanup();
            return Promise.resolve(store.size);
        },
        get items() {
            cleanup();
            return Promise.resolve([...store.keys()]);
        }
    });
};

/**
 * Would try to use fallbackStore as temporary storage for items while
 * mainStore is not able to store items.
 *
 * All other behaviour is backed by mainStore only.
 */
const storeWithFallback = (mainStore, fallbackStore) => {
    if (!mainStore) {
        throw new Error('mainStore should be not null');
    }
    if (!fallbackStore) {
        throw new Error('fallbackStore should be not null');
    }

    let mainStoreFailedLastTime = false;

    return Object.freeze({
        add(item) {
            const continuation = mainStoreFailedLastTime ?
                bluebird.map(fallbackStore.items, item => mainStore.add(item))
                : Promise.resolve();

            return continuation
                .then(() => mainStore.add(item))
                .then(() => {
                    mainStoreFailedLastTime = false;
                    return Promise.resolve();
                })
                .catch(mainError => {
                    winston.info('main store failed to add item: %s', mainError);
                    mainStoreFailedLastTime = true;
                    return fallbackStore.add(item).catch(fallbackError =>
                        Promise.reject([mainError, fallbackError]));
                });
        },
        get size() {
            return mainStore.size;
        },
        get items() {
            return mainStore.items;
        }
    });
}

module.exports = {
    inMemoryStore,
    storeWithFallback
};
