var redis = require('../redis'),
    client = redis.createClient(),
    ttl = 5 * 60; // default ttl 5 minutes

function setLatestVersions(team, versions, ttl) {
    var KEY = `latestVersions-${team}`;

    return client
            .multi()
            .set(KEY, JSON.stringify(versions))
            .expire(KEY, ttl)
            .execAsync()
            .then(() => versions);
}

function getLatestVersions(team) {
    var KEY = `latestVersions-${team}`;

    return client
            .getAsync(KEY)
            .then(versions => versions ?
                                JSON.parse(versions) :
                                null);
}

module.exports = {
    setLatestVersions,
    getLatestVersions
};
