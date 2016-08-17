import * as types from './alice-action-types';

export default function aliceReducer(state = {isLoading: false, serverCountData: [], error: undefined}, action) {
    switch (action.type) {
        case types.FETCHED_SERVER_COUNT:
            return {isLoading: false, serverCountData: action.serverCountData, error: undefined};
        case types.BEGIN_FETCH_SERVER_COUNT:
            return {isLoading: true, serverCountData: [], error: undefined};
        case types.BEGIN_FETCH_SERVER_COUNT:
            return {isLoading: true, serverCountData: [], error: undefined};
        case types.FAIL_FETCH_SERVER_COUNT:
            return {isLoading: false, serverCountData: [], error: action.error};

        default:
            return state;
    }
}
