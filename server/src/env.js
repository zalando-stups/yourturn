var winston = require('winston'),
    path = require('path'),
    fs = require('fs');

/**
 * Returns a JSON object with all the environment variables in it.
 *
 * @return {Object}
 */
function getEnvironment() {
    var env = {};
    for(key in process.env) {
        if (process.env.hasOwnProperty(key)) {
            if (key.indexOf( 'YTENV_' ) === 0 ) {
                env[key] = process.env[key];
            }
        }
    }

    if (process.env.APPDYNAMICS_EUM_KEY) {
        env['APPDYNAMICS_ENABLED'] = true;
    }
        // read client id from mint
    if (process.env.CREDENTIALS_DIR) {
        var clientJsonPath = path.join(process.env.CREDENTIALS_DIR, 'client.json'),
            clientJsonFile,
            clientJson;

        try {
            // try to read it
            clientJsonFile = fs.readFileSync(clientJsonPath);
        } catch(err) {
            winston.error('Could not read client.json: %s', err.message);
            return env;
        }

        try {
            // try to parse it as json
            clientJson = JSON.parse(clientJsonFile);
        } catch(err) {
            winston.error('Could not parse client.json: %s. Content: %s', err.message, clientJsonFile);
            return env;
        }
        // actually set it
        env['YTENV_OAUTH_CLIENT_ID'] = clientJson.client_id;
        winston.info('Successfully updated OAuth client credentials');
    }
    return env;
}

/**
 * Converts a JSON object into a JS script of global variables (trollface).
 *
 * @param  {Object} env The JSON object
 * @return {String} The script containing <KEY>="<VALUE>"; for every key in the object
 */
function convertToScript(env) {
    var script = '';
    for (key in env) {
        if (env.hasOwnProperty(key)) {
            script += key + '="' + env[key] + '";\n';
        }
    }
    return script;
}

/**
 * Gets the environment, converts it to a JS script and writes it to the disk.
 */
function writeEnv() {
    var env = getEnvironment();
    fs.writeFileSync('./dist/env.js', convertToScript(env));
    setTimeout(writeEnv, 1000 * 60 * 60);
}

writeEnv();
