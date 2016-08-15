import Immutable from 'immutable';

/**
 * Returns the resource with this ID, false otherwise.
 *
 * @param  {object} state The current state of the store
 * @param  {string} resourceId ID of the desired resource
 * @return {obj|false} false if it doesn’t exist.
 */
function getResource(state, resourceId) {
    let resource = state.resources.get(resourceId);
    return resource ? resource.toJS() : false;
}

/**
 * Returns the all available resources.
 *
 * @param  {object} state The current state of the store
 * @return {array} An empty array if there are none.
 */
function getResources(state) {
    return state
            .resources
            .valueSeq()
            .filter(r => !r.getResult)
            .sortBy(r => r.get('name').toLowerCase())
            .toJS();
}

/**
 * Returns the scope with this ID for this resource.
 * If there is no such resource or scope, false is
 * returned.
 *
 * @param  {object} state The current state of the store
 * @param  {string} resourceId ID of the resource
 * @param  {string} scopeId ID of the scope
 * @return {obj|false} False if not found.
 */
function getScope(state, resourceId, scopeId) {
    let scopes = state.scopes.get(resourceId);
    if (scopes) {
        let scope = scopes.get(scopeId);
        return scope ? scope.toJS() : false;
    }
    return false;
}

/**
 * Returns all the scopes for this resource.
 *
 * @param  {object} state The current state of the store
 * @param  {string} resourceId ID of the resource
 * @return {array} Empty array if there are not scopes.
 */
function getScopes(state, resourceId) {
    return state
            .scopes
            .get(resourceId, Immutable.Map())
            .valueSeq()
            .filter(s => !s.getResult)
            .sortBy(s => s.get('id').toLowerCase())
            .toJS();
}

/**
 * Returns all scopes of all resource types.
 *
 * @param  {object} state The current state of the store
 * @return {Array} Scopes
 */
function getAllScopes(state) {
    return state
            .scopes
            .valueSeq()
            .map(s => s.valueSeq())
            .flatten(true) // only one level
            .filter(s => !s.getResult)
            .sortBy(s => s.get('id').toLowerCase())
            .toJS();
}

/**
 * Returns all the applications for a given scope.
 *
 * @param  {object} state The current state of the store
 * @param  {string} resourceId ID of the resource
 * @param  {string} scopeId ID of the scope
 * @return {array} Empty array if there are no applications with this scope.
 */
function getScopeApplications(state, resourceId, scopeId) {
    let apps = state.scopeApps.get(`${resourceId}.${scopeId}`, Immutable.List());
    return apps
            .sortBy(a => a.get('id').toLowerCase())
            .toJS();
}

export {
    getResource,
    getResources,
    getScope,
    getScopes,
    getAllScopes,
    getScopeApplications
};
