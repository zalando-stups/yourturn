var camel = require('camel-case'),
    xml2js = require('xml2js').parseString,
    yml2js = require('js-yaml'),
    winston = require('winston'),
    fs = require('fs'),
    APPDYNAMICS_CONFIG = '/agents/appdynamics-jvm/conf/controller-info.xml',
    NEW_RELIC_CONFIG = '/agents/newrelic/newrelic.yml';

// FIRST, LETS CHECK FOR APPDYNAMICS
if (fs.existsSync(APPDYNAMICS_CONFIG)) {
    var xmlFile;
    try {
        xmlFile = String(fs.readFileSync(APPDYNAMICS_CONFIG));
    } catch (err) {
        winston.error('Could not read appdynamics config XML.', err.message);
    }
    xml2js(xmlFile, function (err, result) {
        if (err) {
            winston.error('Could not parse appdynamics config XML. Error: %s. Content: %s.', err.message, xmlFile);
            return;
        }
        var config = Object
            .keys(result['controller-info'])
            .map(function(key) {
                return [camel(key), result['controller-info'][key][0]];
            })
            .reduce(function(prev, cur) {
                var key = cur[0] === 'controllerHost' ? 'controllerHostName' : cur[0],
                    val = cur[1];
                // convert string values
                if (val === 'true') {
                    prev[key] = true;
                } else if (val === 'false') {
                    prev[key] = false;
                } else if (/^[0-9]+$/.test(val)) {
                    prev[key] = parseInt(val, 10);
                } else {
                    prev[key] = val;
                }
                return prev;
            }, {});
        require('appdynamics').profile(config);
        winston.info('Successfully started appdynamics with config %s', JSON.stringify(config, null, 4));
    });
// check if there is a new relic config file
} else if (fs.existsSync(NEW_RELIC_CONFIG)) {
    // OR, YOU KNOW, NEW RELIC
    try {
        var yaml = yml2js.safeLoad(fs.readFileSync(NEW_RELIC_CONFIG), 'utf8').common,
            config = {
                app_name: [yaml.app_name],
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
