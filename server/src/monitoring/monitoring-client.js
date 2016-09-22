var winston = require('winston'),
    fs = require('fs'),
    APPDYNAMICS_SCRIPT = './monitoring/appdynamics-client.js';

var appKey = process.env.APPDYNAMICS_RUM_KEY;

if (!appKey) {
    winston.error('APPDYNAMICS_RUM_KEY not set in environment');
    return;
}

if (fs.existsSync(APPDYNAMICS_SCRIPT)) {
    var adScript;
    try {
        adScript = String(fs.readFileSync(APPDYNAMICS_SCRIPT));
        var adScriptInjectedKey = adScript.replace('a.appKey=""', 'a.appKey="' + appKey + '"');
        fs.writeFileSync('./dist/adrum.js', adScriptInjectedKey);
    } catch (err) {
        winston.error('Could not read appdynamics-client.js file or error processing it.', err.message);
    }
} else {
    winston.error('appdynamics-client.js file not found');
    return;
}
