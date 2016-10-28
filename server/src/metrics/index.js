const bluebird = require('bluebird');
const isFunction = require('lodash.isfunction');
const winston = require('winston');

const cachedProvider = (provider, defaultResult) => {
    if (!provider) {
        throw new Error('provider should be not null');
    }
    if (defaultResult === undefined || defaultResult === null) {
        throw new Error('defaultResult should be not null');
    }

    let cachedResult = defaultResult;
    return () => new Promise(resolve => resolve(isFunction(provider) ? provider() : provider))
        .then(result => {
            cachedResult = result;
            return result;
        })
        .catch(err => {
            winston.error('provider failed: %s', err);
            return cachedResult;
        })
};

const report = ({
    providers = {}
} = {}) => Object.freeze({
    generate() {
        return bluebird.props(Object.keys(providers || {})
            .reduce((report, name) => {
                const provider = providers[name];
                report[name] = new Promise(resolve => {
                    resolve(isFunction(provider) ? provider() : provider);
                });
                return report;
            }, {}));
    },
});

module.exports = {
    report,
    cachedProvider
};
