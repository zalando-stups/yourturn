import * as types from './alice-action-types';

export default function aliceReducer(state = {isLoading: false, instanceCountData: [], error: undefined}, action) {
    switch (action.type) {
        case types.FETCHED_INSTANCE_COUNT:
            return {isLoading: false, instanceCountData: action.instanceCountData, error: undefined};
        case types.BEGIN_FETCH_INSTANCE_COUNT:
            return {isLoading: true, instanceCountData: [], error: undefined};
        case types.FAIL_FETCH_INSTANCE_COUNT:
            return {isLoading: false, instanceCountData: [], error: action.error};

        default:
            return state;
    }
}
