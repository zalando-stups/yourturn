/**
 * Returns OAuth configuration for application with `id`. Empty config otherwise.
 *
 * @param  {object} state The current state of the store
 * @param  {String} applicationId ID of the application
 * @return {Object|false} Empty configuration if unavailable.
 */
function getOAuthConfig(state, applicationId) {
    let config = state.get(applicationId);
    return config ? config.toJS() : false;
}

export {
    getOAuthConfig
};
