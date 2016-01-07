import Immutable from 'immutable';
import {Pending, Failed} from 'common/src/fetch-result';
import Types from './mint-types';
import * as Getter from './mint-getter';

function MintStore(state = Immutable.Map(), action) {
    if (!action) {
        return state;
    }

    let {type, payload} = action;

    if (type === Types.BEGIN_FETCH_OAUTH_CONFIG) {
        return state.set(payload, new Pending());
    } else if (type === Types.FAIL_FETCH_OAUTH_CONFIG) {
        return state.set(payload.id, new Failed(payload));
    } else if (type === Types.FETCH_OAUTH_CONFIG) {
        let [applicationId, config] = payload;
        return state.set(applicationId, Immutable.fromJS(config));
    }

    return state;
}

export default MintStore;
