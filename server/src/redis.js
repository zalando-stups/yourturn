var redis = require('redis'),
    winston = require('winston'),
    bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

var client = redis.createClient(
        process.env.YTENV_REDIS_PORT || '6379',
        process.env.YTENV_REDIS_HOST || '127.0.0.1');

client.on('error', winston.error.bind(winston));

module.exports = client;
