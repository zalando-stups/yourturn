import Immutable from 'immutable';
import Types from './kio-types';
import {Pending, Failed} from 'common/src/fetch-result';

const FETCH_STATE = 'fetchApplications',
    APPS = 'applications',
    DEFAULT_STATE = Immutable.fromJS({
        'fetchApplications': false,
        'applications': {}
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
        return state.setIn([APPS, payload], new Pending());
    } else if (type === Types.FAIL_FETCH_APPLICATION) {
        return state.setIn([APPS, payload.id], new Failed(payload));
    } else if (type === Types.FETCH_APPLICATION || type == Types.SAVE_APPLICATION) {
        return state.setIn([APPS, payload.id], Immutable.Map(payload));
    } else if (type === Types.FETCH_APPLICATIONS) {
        state = payload.reduce((map, app) => map.setIn([APPS, app.id], Immutable.Map(app)), state);
        return state.set(FETCH_STATE, false);
    }
    return state;
}

export default ApplicationStore;

export {
    FETCH_STATE as FETCH_STATE
};