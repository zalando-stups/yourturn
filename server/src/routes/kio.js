var winston = require('winston'),
    Promise = require('bluebird'),
    kio = require('../data/kio'),
    redis = require('../data/redis'),
    BATCH_SIZE = 5;

/**
 * Returns the last item of an array or null, if it doesn't exist.
 */
function last(array) {
    return array.length === 0 ? null : array[array.length - 1];
}

/**
 * Executes the functions without arguments and returns an array
 * with the results.
 */
function exec(funcs) {
    return funcs.map(fn => fn());
}

/**
 * Partitions the array in smaller arrays of maximum
 * size `partitionSize`.
 */
function partition(array, partitionSize) {
    if (!partitionSize || partitionSize <= 1) {
        return array;
    }

    function reducerFn(partitions, currentElement) {
        var currentPartition;
        if (partitions.length === 0 || last(partitions).length === partitionSize) {
            // make a new partition
            currentPartition = [currentElement];
            partitions.push(currentPartition);
        } else {
            // use last partition
            currentPartition = last(partitions);
            currentPartition.push(currentElement);
        }
        return partitions;
    }

    return array.reduce(reducerFn, []);
}

function _getLatestVersions(team) {
    return kio
            .apps()
            // filter by team
            // TODO use team filter in kio when it's available
            .then(apps => apps.filter(a => a.team_id === team))
            // get versions for all apps of this team
            // but batch them and execute only [batch size] requests in parallel
            // to not overwhelm kio with hundreds requests
            .then(apps => apps.map(app => kio.versions.bind(kio, app.id)))
            .then(requests => partition(requests, BATCH_SIZE))
            // sequentially execute batched requests
            // and make it so that one failing batch does not kill the whole process
            .then(reqPartitions => reqPartitions.reduce(
                    (promise, reqs) => promise.then(versions => Promise
                                                                    .all(versions.concat(exec(reqs)))
                                                                    .finally(errOrValue => errOrValue instanceof Error ?
                                                                                reqs.map(req => []) :
                                                                                errOrValue)),
                    Promise.resolve([])))
            .then(all => all
                        .filter(versions => versions.length > 0)
                        .map(versions => versions
                                            .map(v => {
                                                var c = Object.assign({}, v);
                                                c.timestamp = new Date(v.last_modified).getTime();
                                                return c;
                                            })
                                            .reduce((l, v) => Math.max(l.timestamp, v.timestamp) === l.timestamp ?
                                                                l :
                                                                v)));
}

function latestVersions(req, res) {
    var TEAM = req.params.team;

    // first check if we have it in redis
    redis
    .getLatestVersions(TEAM)
    .then(versions => {
        if (versions !== null) {
            winston.debug('Cache hit for latestVersions:' + TEAM);
            // YEAH
            return res
                    .status(200)
                    .type('json')
                    .send(versions);
        }
        winston.debug('Cache miss for latestVersions:' + TEAM);
        // fetch from kio all the stuff
        _getLatestVersions(TEAM)
        // put it in redis
        .then(latestVersions => redis.setLatestVersions(TEAM, latestVersions))
        // return what we got
        .then(latestVersions => res
                                .status(200)
                                .type('json')
                                .send(latestVersions))
        // catch-all
        .catch(err => res.status(503).send(err));
    })
    .catch(err => {
        // when we get here, redis is unavailable
        winston.error(err);
        // fallback: do not use redis
        _getLatestVersions(TEAM)
        .then(latestVersions => res
                                .status(200)
                                .type('json')
                                .send(latestVersions))
        // and so is kio if we get here
        .catch(err => res.status(503).send(err))
    });
}

module.exports = {
    latestVersions
};
