import Immutable from 'immutable';
import Types from './kio-types';
import {Pending, Failed} from 'common/src/fetch-result';

function VersionStore(state = Immutable.Map(), action) {
    if (!action) {
        return state;
    }

    let {type, payload} = action;

    if (type === Types.BEGIN_FETCH_APPLICATION_VERSION) {
        let [id, ver] = payload;
        return state.setIn([id, ver], new Pending());
    } else if (type === Types.FAIL_FETCH_APPLICATION_VERSION) {
        let {id, ver} = payload;
        return state.setIn([id, ver], new Failed(payload));
    } else if (type === Types.RECEIVE_APPLICATION_VERSION) {
        return VersionStore(state, {
            type: Types.RECEIVE_APPLICATION_VERSIONS,
            payload: [payload]
        });
    } else if (type === Types.RECEIVE_APPLICATION_VERSIONS) {
        return payload.reduce(
                        (map, ver) => {
                            ver.last_modified = Date.parse(ver.last_modified);
                            return map.setIn([ver.application_id, ver.id], Immutable.Map(ver));
                        },
                        state);
    }

    return state;
}

export default VersionStore;