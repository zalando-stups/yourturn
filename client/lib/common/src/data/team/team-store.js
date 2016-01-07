import Immutable from 'immutable';
import Types from './team-types';
import * as Getter from './team-getter';

function TeamStore(state = Immutable.List(), action) {
    if (!action) {
        return state;
    }

    let {type, payload} = action;

    if (type === Types.FETCH_ACCOUNTS) {
        return Immutable.fromJS(payload);
    }

    return state;
}

export {
    TeamStore as TeamStore
};
