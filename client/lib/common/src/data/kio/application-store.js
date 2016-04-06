import Immutable from 'immutable';
import Types from './kio-types';
import {Pending, Failed} from 'common/src/fetch-result';

const FETCH_STATE = 'fetchApplications',
    PREF_ACCOUNT = 'preferredAccount',
    APPS = 'applications',
    DEFAULT_STATE = Immutable.fromJS({
        'fetchApplications': false,
        'applications': {},
        'preferredAccount': false,
        'tabAccounts': [],
        'selectedTab': false
    });

function ApplicationStore(state = DEFAULT_STATE, action) {
    if (!action) {
        return state;
    }

    let {type, payload} = action;

    if (type === Types.BEGIN_FETCH_APPLICATIONS) {
        return state.set(FETCH_STATE, new Pending());
    } else if (type === Types.FAIL_FETCH_APPLICATIONS) {
        return state.set(FETCH_STATE, new Failed());
    } else if (type === Types.BEGIN_FETCH_APPLICATION) {
        // explanation for payload[0]:
        // the BEGIN action is dispatched by the flummox compat middleware
        // which passes all arguments it was originally called with as an array
        // so we have to take the first one here

        // this is a quite an abstraction leak actually
        return state.setIn([APPS, payload[0]], new Pending());
    } else if (type === Types.FAIL_FETCH_APPLICATION) {
        return state.setIn([APPS, payload.id], new Failed(payload));
    } else if (type === Types.FETCH_APPLICATION) {
        return state.setIn([APPS, payload.id], Immutable.Map(payload));
    } else if (type === Types.FETCH_APPLICATIONS) {
        state = payload.reduce((map, app) => map.setIn([APPS, app.id], Immutable.Map(app)), state);
        return state.set(FETCH_STATE, false);
    } else if (type === Types.LOAD_PREFERRED_ACCOUNT ||
               type === Types.SAVE_PREFERRED_ACCOUNT) {
        return state.set(PREF_ACCOUNT, action.payload);
    } else if (type === Types.LOAD_TAB_ACCOUNTS ||
               type === Types.SAVE_TAB_ACCOUNTS) {
        return state.set('tabAccounts', action.payload);
    } else if (type === Types.SET_SELECTED_TAB) {
        return state.set('selectedTab', action.payload);
    }
    return state;
}

export default ApplicationStore;

export {
    FETCH_STATE,
    PREF_ACCOUNT
};