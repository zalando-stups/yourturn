import Immutable from 'immutable';
import Types from './essentials-types';
import {Pending, Failed} from 'common/src/fetch-result';

function ScopeStore(state = Immutable.Map(), action) {
    if (!action) {
        return state;
    }

    let {type, payload} = action;

    if (type === Types.BEGIN_FETCH_SCOPE) {
        let [resource, scope] = payload;
        return state.setIn([resource, scope], new Pending());
    } else if (type === Types.FAIL_FETCH_SCOPE) {
        return state.set(payload.id, new Failed(payload));
    } else if (type === Types.FETCH_SCOPE) {
        let [resourceId, scope] = payload;
        return ScopeStore(state, {
            type: Types.FETCH_SCOPES,
            payload: [resourceId, [scope]]
        });
    } else if (type === Types.FETCH_SCOPES) {
        let [resourceId, scopes] = payload;
        return scopes.reduce((map, scp) => {
            scp.resource_type_id = resourceId;
            return map.setIn([resourceId, scp.id], Immutable.fromJS(scp));
        }, state);
    }

    return state;
}

export default ScopeStore;