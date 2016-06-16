import Immutable from 'immutable';
import {Pending, Failed} from 'common/src/fetch-result';
import Types from './magnificent-types';

function MagnificentStore(state = Immutable.Map(), action) {
    if (!action) {
        return state;
    }

    let {type, payload} = action;
    if (type === Types.BEGIN_FETCH_AUTH) {
        return state.set(payload[0], new Pending(false));
    } else if (type === Types.FAIL_FETCH_AUTH) {
        return state.set(payload.team, new Failed(payload));
    } else if (type === Types.FETCH_AUTH) {
        return state.set(payload.team, payload.allowed)
    }
    return state;
}

export default MagnificentStore;
