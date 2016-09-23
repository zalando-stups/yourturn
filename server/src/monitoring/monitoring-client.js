var winston = require('winston'),
    fs = require('fs'),
    APPDYNAMICS_SCRIPT = './monitoring/appdynamics-client.js',
    appdBeacon = process.env.APPDYNAMICS_EUM_BEACON,
    appdEumKey = process.env.APPDYNAMICS_EUM_KEY;


if (!appdEumKey || !appdBeacon) {
    winston.error('APPDYNAMICS_EUM_KEY or APPDYNAMICS_EUM_BEACON not set in environment');
    return;
}

if (fs.existsSync(APPDYNAMICS_SCRIPT)) {
    try {
        var adScript = String(fs.readFileSync(APPDYNAMICS_SCRIPT));
        var adScriptInjectedKey = adScript
                                    .replace(/\$\{APPDYNAMICS_EUM_KEY\}/g, appdEumKey)
                                    .replace(/\$\{APPDYNAMICS_EUM_BEACON\}/g, appdBeacon);
        fs.writeFileSync('./dist/adrum.js', adScriptInjectedKey);
    } catch (err) {
        winston.error('Could not read appdynamics-client.js file or error processing it.', err.message);
    }
} else {
    winston.error('appdynamics-client.js file not found');
    return;
}
