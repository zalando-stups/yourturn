var yml2js = require('js-yaml'),
    winston = require('winston'),
    NEW_RELIC_CONFIG = '/agents/newrelic/newrelic.yml';

// NEW RELIC
// check if there is a new relic config file
if (fs.existsSync(NEW_RELIC_CONFIG)) {
    try {
        var yaml = yml2js.safeLoad(fs.readFileSync(NEW_RELIC_CONFIG), 'utf8').common,
            config = {
                app_name: [ yaml.app_name ],
                license_key: yaml.license_key,
                logging: {
                    level: yaml.log_level
                }
            };
        fs.writeFileSync('newrelic.js', 'exports.config = ' + JSON.stringify(config) + ';');
        require('newrelic');
    } catch (e) {
        winston.error('Could not load New Relic config', e);
        return;
    }
}