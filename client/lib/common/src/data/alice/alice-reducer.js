import * as types from './alice-action-types';

export default function aliceReducer(state = {loading: false, serverCountData: []}, action) {
    switch (action.type) {
        case types.FETCHED_SERVER_COUNT:
            return Object.assign({}, state, {serverCountData: action.serverCountData});

        default:
            return state;
    }
}
