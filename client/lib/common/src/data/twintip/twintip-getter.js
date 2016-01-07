/**
 * Returns the API for application with `id`. Does not care about its state, e.g. whether or not
 * it's Pending or Failed.
 *
 * @param  {object} state the current state of the store
 * @param  {String} id
 * @return {object} The API with this id
 */
function getApi(state, id) {
    let api = state.get(id);
    return api ? api.toJS() : false;
}

function getApis(state) {
    return state.valueSeq().toJS();
}

export {
    getApi,
    getApis
};