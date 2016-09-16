var winston = require('winston'),
    fs = require('fs'),
    APPDYNAMICS_SCRIPT = './monitoring/appdynamics-client.js';

var appKey = process.env.APPDYNAMICS_APPKEY;

if (!appKey) {
    winston.error('APPDYNAMICS_APPKEY not set in environment');
    return;
}

if (fs.existsSync(APPDYNAMICS_SCRIPT)) {
    var adScript;
    try {
        adScript = String(fs.readFileSync(APPDYNAMICS_SCRIPT));
    } catch (err) {
        winston.error('Could not read appdynamics js file.', err.message);
    }
    var adScriptInjectedKey = adScript.replace('a.appKey=', 'a.appKey="' + appKey + '"');
    fs.writeFileSync('./dist/adrum.js', adScriptInjectedKey);
} else {
    winston.error('appdynamics js file not found');
    return;
}
