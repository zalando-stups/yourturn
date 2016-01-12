import {createActionTypes} from 'common/src/util';

const TYPES = [
    'FETCH_VIOLATIONS',
    'FETCH_VIOLATION',
    'FETCH_VIOLATION_TYPES',
    'FETCH_VIOLATION_COUNT',
    'FETCH_VIOLATION_COUNT_IN',
    'RESOLVE_VIOLATION',
    'DELETE_VIOLATIONS',
    'UPDATE_SEARCH_PARAMS',
    'FETCH_OWN_TOTAL',
    'SAVE_LAST_VISITED',
    'LOAD_LAST_VISITED'
];

export default createActionTypes(TYPES);