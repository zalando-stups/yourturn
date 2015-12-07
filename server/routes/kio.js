var kio = require('../data/kio'),
    redis = require('../data/redis');

function latestVersions(req, res) {
    var TEAM = req.param.team;

    // first check if we have it in redis
    redis
    .getLatestVersions(TEAM)
    .then(versions => {
        if (versions) {
            winston.debug('Cache hit for latestVersions:' + TEAM);
            // YEAH
            return res
                    .status(200)
                    .type('json')
                    .send(versions);
        }
        winston.debug('Cache miss for latestVersions:' + TEAM);
        // fetch from kio all the stuff
        kio
        .apps()
        .then(apps => Promise.all(
                        apps
                        .filter(a => a.team_id === TEAM)
                        .map(a => kio.versions(a))))
        .then(all => all.map(versions => versions
                                            .filter(v => v.length > 0)
                                            .map(v => ({
                                                ...v,
                                                last_modfiied: Date.parse(v.last_modified)
                                            }))
                                            .reduce((l, v) => Math.max(l.last_modfiied, v.last_modified) === l.last_modified ?
                                                                l.last_modified :
                                                                v.last_modified)))
        // put it in redis
        .then(latestVersions => redis.setLatestVersions(TEAM, latestVersions))
        // return what we got
        .then(latestVersions => res.status(200).type('json').send(latestVersions))
        .catch(err => res.status(500).send(err));
    });
}

module.exports = {
    latestVersions
};