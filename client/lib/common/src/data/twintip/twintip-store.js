import Immutable from 'immutable';
import Types from './twintip-types';
import {Pending, Failed} from 'common/src/fetch-result';

function TwintipStore(state = Immutable.Map(), action) {
    if (!action) {
        return state;
    }
    let {type, payload} = action;
    if (type === Types.FETCH_API) {
        return state.set(payload.application_id, Immutable.fromJS(payload));
    } else if (type === Types.BEGIN_FETCH_API) {
        return state.set(payload[0], new Pending());
    } else if (type === Types.FAIL_FETCH_API) {
        return state.set(payload.id, new Failed(payload));
    }
    return state;
}

export default TwintipStore;
