var redis = require('../redis'),
    utils = require('../redis-utils'),
    ttl = 5 * 60; // default ttl 5 minutes

function setLatestVersions(team, versions) {
    if (!utils.isAvailable(redis)) {
        return Promise.reject(utils.unavailableError());
    }
    var KEY = `latestVersions-${team}`;
    return redis
            .multi()
            .set(KEY, JSON.stringify(versions))
            .expire(KEY, ttl)
            .execAsync()
            .then(() => versions);
}

function getLatestVersions(team) {
    if (!utils.isAvailable(redis)) {
        return Promise.reject(utils.unavailableError());
    }
    var KEY = `latestVersions-${team}`;
    return redis
            .getAsync(KEY)
            .then(versions => versions ?
                                JSON.parse(versions) :
                                null);
}

function setFaultyMintInfo(appId, info) {
    if (!utils.isAvailable(redis)) {
        return Promise.reject(utils.unavailableError());
    }
    var KEY = `faultyMintAppInfo-${appId}`;
    return redis
        .multi()
        .set(KEY, JSON.stringify(info))
        .expire(KEY, ttl)
        .execAsync()
        .then(() => info);
}

function getFaultyMintInfo(appId) {
    if (!utils.isAvailable(redis)) {
        return Promise.reject(utils.unavailableError());
    }
    var KEY = `faultyMintAppInfo-${appId}`;
    return redis
            .getAsync(KEY)
            .then(info => info ?
                JSON.parse(info) :
                null);
}

module.exports = {
    setLatestVersions,
    getLatestVersions,
    setFaultyMintInfo,
    getFaultyMintInfo
};
