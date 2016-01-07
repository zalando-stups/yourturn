import Immutable from 'immutable';
import {Pending, Failed} from 'common/src/fetch-result';
import Types from './pierone-types';
import * as Getter from './pierone-getter';

function PieroneStore(state = Immutable.fromJS({
    scmSources: {},
    tags: {}
}), action) {
    if (!action) {
        return state;
    }

    let {type, payload} = action;

    if (type === Types.BEGIN_FETCH_SCM_SOURCE) {
        let [team, artifact, tag] = payload;
        return state.setIn(['scmSources', team, artifact, tag], new Pending());
    } else if (type === Types.FAIL_FETCH_SCM_SOURCE) {
        let {team, artifact, tag} = payload;
        if (payload.status === 404) {
            return state.setIn(['scmSources', team, artifact, tag], false);
        }
        return state.setIn(['scmSources', team, artifact, tag], new Failed(payload));
    } else if (type === Types.FETCH_SCM_SOURCE) {
        let [team, artifact, tag, scmSource] = payload;
        return state.setIn(['scmSources', team, artifact, tag], Immutable.fromJS(scmSource));
    } else if (type === Types.FETCH_TAGS) {
        let [team, artifact, tags] = payload;
        return state.setIn(['tags', team, artifact], Immutable.fromJS(tags));
    }

    return state;
}

export {
    PieroneStore
};
