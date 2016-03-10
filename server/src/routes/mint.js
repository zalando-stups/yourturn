var winston = require('winston'),
    kio = require('../data/kio'),
    redis = require('../data/redis'),
    mint = require('../data/mint');

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

}

function faultyMintInfo(req, res) {
    var APPS = req.params.apps;

    // first check if we have it in redis
    var promise = Promise.all(
        APPS.map(appId =>
                redis
                    .getFaultyMintInfo(appId)
                    .then(info => {
                        if (info) {
                            winston.debug('Cache hit for faultyMintInfo:' + appId);
                            winston.info('Cache hit for faultyMintInfo:' + appId);
                            // YEAH
                            return info;
                        } else {
                            winston.debug('Cache miss for faultyMintInfo:' + appId);
                            winston.info('Cache miss for faultyMintInfo:' + appId);
                            // fetch from mint
                            return getFaultyMintInfo(appId)
                            // put it in redis
                                .then(info => {
                                    if (info) {
                                        redis.setFaultyMintInfo(appId, info);
                                        return info;
                                    }
                                })
                                .catch(() => null);
                        }
                    })
                    .catch(err => {
                        // when we get here, redis is unavailable
                        winston.error(err);
                        // fallback: do not use redis
                        getFaultyMintInfo(appId)
                            .then(info => {
                                if (info !== null) {
                                    redis.setFaultyMintInfo(appId, info);
                                    return info;
                                }
                            })
                            // and so is mint if we get here
                            .catch(err => res.status(503).send(err))
                    })
            ));
    promise.then(output => {
        output = output.reduce((map, info) => {
            if(info){
                map[info.id] = info;
            }
            return map;
        }, {});
        res
            .status(200)
            .type('json')
            .send(output);
    });
}
module.exports = {
    faultyMintInfo
};
