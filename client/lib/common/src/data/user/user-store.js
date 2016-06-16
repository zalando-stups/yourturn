import Immutable from 'immutable';
import Types from './user-types';
import * as Getter from './user-getter';

function UserStore(state, action) {
    const DEFAULT_STATE = Immutable.fromJS({
        tokeninfo: {},
        uid: false,
        users: {},
        accounts: [],
        teams: []
    });

    if (!state) {
        return DEFAULT_STATE;
    }

    if (!action) {
        return state;
    }

    let {type, payload} = action;

    if (type === Types.FETCH_USERINFO) {
        let [user, info] = payload;
        return state.setIn(['users', user], Immutable.fromJS(info));
    } else if (type === Types.FETCH_TOKENINFO) {
        return state.set('tokeninfo', Immutable.fromJS(payload));
    } else if (type === Types.FETCH_USERACCOUNTS) {
        const activeAccounts = payload.filter(acc => !acc.disabled);
        return state.set('accounts', Immutable.fromJS(activeAccounts));
    } else if (type === Types.DELETE_TOKENINFO) {
        return state.set('tokeninfo', false);
    } else if (type === Types.FETCH_USERTEAMS) {
        return state.set('teams', Immutable.fromJS(payload));
    }

    return state;
}

export default UserStore;
