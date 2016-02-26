var winston = require('winston'),
    Promise = require('bluebird'),
    kio = require('../data/kio'),
    redis = require('../data/redis'),
    mint = require('../data/mint'),
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

function getFaultyMintInfo(appId) {
    return mint
            .app(appId)
            .then(info => {
                if (info.has_problems === true) {
                    return info;
                } else {
                    return null;
                }
            });
            //.then(requests => partition(requests, BATCH_SIZE))
            // sequentially execute batched requests
            // and make it so that one failing batch does not kill the whole process
            //.then(reqPartitions => reqPartitions.reduce(
            //    (promise, reqs) => promise.then(info => Promise
            //        .all(info.concat(exec(reqs)))
            //        .finally(errOrValue => errOrValue instanceof Error ?
            //            reqs.map(req => []) :
            //            errOrValue)),
            //    Promise.resolve([])));
    //return mint
    //    .app(appId)
    //    .then(info => {
    //        if (info.has_problems === true) {
    //            return info;
    //        } else {
    //            return null;
    //        }
    //    });

}

function faultyMintInfo(req, res) {
    var APPS = req.params.apps;

    var faultyInfo = {};
    // first check if we have it in redis
    APPS.map(appId =>
        redis
            .getFaultyMintInfo(appId)
            .then(info => {
                if (info !== null) {
                    winston.debug('Cache hit for faultyMintInfo:' + appId);
                    // YEAH
                    faultyInfo[appId] = info;
                    //return res
                    //    .status(200)
                    //    .type('json')
                    //    .send(info);
                } else {

                    winston.debug('Cache miss for faultyMintInfo:' + appId);
                    // fetch from kio all the stuff
                    getFaultyMintInfo(appId)
                    // put it in redis
                    .then(info => {
                        if (info !== null) {
                            redis.setFaultyMintInfo(appId, info);
                            faultyInfo[appId] = info;
                        }
                    });
                    // return what we got
                    //.then(latestVersions => res
                    //    .status(200)
                    //    .type('json')
                    //    .send(info))
                    //// catch-all
                    //.catch(err => res.status(503).send(err));
                }
            })
            .then(() => res
                        .status(200)
                        .type('json')
                        .send(faultyInfo))
            .catch(err => {
                // when we get here, redis is unavailable
                winston.error(err);
                // fallback: do not use redis
                getFaultyMintInfo(appId)
                    .then(info => {
                        if (info !== null) {
                            redis.setFaultyMintInfo(appId, info);
                            faultyInfo[appId] = info;
                        }
                    })
                    //.then(info => res
                    //    .status(200)
                    //    .type('json')
                    //    .send(info))
                    // and so is mint if we get here
                    .catch(err => res.status(503).send(err))
            }));

}
module.exports = {
    faultyMintInfo
};
