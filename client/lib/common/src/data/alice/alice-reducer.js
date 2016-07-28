import * as types from './alice-action-types';

export default function aliceReducer(state = [], action) {
    switch (action.type) {
        case types.FETCHED_SERVER_COUNT:
            return action.serverCountData;

        default:
            return state;
    }
}
