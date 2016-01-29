import Immutable from 'immutable';
import Types from './team-types';

const DEFAULT_STATE = Immutable.fromJS({
    accounts: [],
    teams: {},
    alias: {}
});

function TeamStore(state = DEFAULT_STATE, action) {
    if (!action) {
        return state;
    }

    let {type, payload} = action;

    if (type === Types.FETCH_ACCOUNTS) {
        return state.set('accounts', Immutable.fromJS(payload));
    } else if (type === Types.FETCH_TEAM) {
        // add team
        state = state.setIn(['teams', payload.id], Immutable.fromJS(payload));
        // update aliase
        state = payload.alias.reduce((map, alias) => map.setIn(['alias', alias], payload.id), state);
        state = state.setIn(['alias', payload.id], payload.id);
        return state;
    }

    return state;
}

export default TeamStore;
