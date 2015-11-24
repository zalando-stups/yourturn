/**
 * Returns the available search results for `term` grouped by source.
 *
 * @param  {object} state Current state of the store
 * @param  {String} term
 * @return {Array} Is empty if no results are available.
 */
function getSearchResults(state, term) {
    let results = state.get(term);
    return results ? results.groupBy(r => r.get('_source', false)).toJS() : [];
}

/**
 * Returns true if there is an entry for `term`. Might
 * be empty though.
 *
 * @param  {object} state Current state of the store
 * @param  {String}  term
 * @return {Boolean} True if `term` is associated with the underlying hashmap.
 */
function hasResults(state, term) {
    return state.has(term);
}

export {
    getSearchResults,
    hasResults
};
