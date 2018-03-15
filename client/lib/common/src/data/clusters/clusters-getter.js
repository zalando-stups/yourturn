/**
 * Returns all lubernetes clusters.
 *
 * @param  {object} state The current state of the store
 * @return {Array} clusters
 */
function getAllClusters(state) {
    return state
            .kubernetes_clusters
            .valueSeq()
            //.filter(s => {console.log('=====>', s);return s.get('environment') === 'production'})
            .sortBy(s => {
              return s.get('alias').toLowerCase()})
            .toJS();
}

export {
    getAllClusters
};
