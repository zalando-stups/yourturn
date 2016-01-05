import Immutable from 'immutable';
import Types from './essentials-types';
import {Pending, Failed} from 'common/src/fetch-result';

function ResourceStore(state = Immutable.Map(), action) {
    if (!action) {
        return state;
    }

    let {type, payload} = action;

    if (type === Types.BEGIN_FETCH_RESOURCE) {
        return state.set(payload, new Pending());
    } else if (type === Types.FAIL_FETCH_RESOURCE) {
        return state.set(payload.id, new Failed(payload));
    } else if (type === Types.FETCH_RESOURCE) {
        return state.set(payload.id, Immutable.fromJS(payload));
    } else if (type === Types.FETCH_RESOURCES) {
        return payload.reduce((map, res) => map.set(res.id, Immutable.fromJS(res)), state);
    }

    return state;
}

export default ResourceStore;