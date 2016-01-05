import Immutable from 'immutable';
import Types from './essentials-types';

function ScopeApplicationStore(state = Immutable.Map(), action) {
    if (!action) {
        return state;
    }

    let {type, payload} = action;

    if (type === Types.FETCH_SCOPE_APPLICATIONS) {
        let [resourceId, scopeId, applications] = payload;
        return state.set(`${resourceId}.${scopeId}`, Immutable.fromJS(applications));
    }

    return state;
}

export default ScopeApplicationStore;