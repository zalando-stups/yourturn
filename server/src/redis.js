var redis = require('redis'),
    bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

//FIXME pass redis environment variables here
module.exports = redis.createClient();
