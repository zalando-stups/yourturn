import superagent from 'superagent';

/**
 * Just like superagent.end, but returning a promise.
 *
 * @return {Promise}
 */
function exec() {
    return new Promise((resolve, reject) => {
        this.end((error, res) => {
            if (error) {
                return reject(error);
            }
            resolve(res);
        });
    });
}

superagent.Request.prototype.ensureTokenValidity = function() {
    // This function would fetch a token from the provider
};

superagent.Request.prototype.exec = function() {
    // if this request doesn't have oauth enabled,
    // just execute itgw
    if (!this._oauthEnabled) {
        return exec.call(this);
    }
    return new Promise((resolve, reject) => {
        let provider = this._oauthProvider;
        // otherwise we need to
        // - check if we have a token for this provider in our storage
        if (provider.hasToken()) {
            // there is a token and WE WILL USE IT FOR FUCKS SAKE
            // it might be invalid tho

            // set appropriate header
            this.set('Authorization', `Token ${provider.getToken()}`);
            // execute request
            exec
                .call(this)
                .then(resolve)  // token was apparently ok
                .catch();   //FIXME check the error and update token if necessary
        }


    });
};

/**
 * Tell superagent to use a specific oauth provider.
 *
 * @param  {OAuthProvider} provider
 * @return {self} superagent
 */
superagent.Request.prototype.oauth = function(provider) {
    this._oauthEnabled = true;
    this._oauthProvider = provider;
    return this;
};


export default superagent;