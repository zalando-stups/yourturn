import Immutable from 'immutable';

function getTags(state, team, artifact) {
    return state.getIn(['tags', team, artifact], Immutable.List()).toJS();
}

function getScmSource(state, team, artifact, tag) {
    let exists = state.getIn(['scmSources', team, artifact, tag]);
    return exists ? exists.toJS() : false;
}

export {
    getTags as getTags,
    getScmSource as getScmSource
};