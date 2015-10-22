import {createActionTypes} from 'common/src/util';

const TYPES = [
    'BEGIN_FETCH_VIOLATIONS',
    'FAIL_FETCH_VIOLATIONS',
    'RECEIVE_VIOLATIONS',
    'BEGIN_FETCH_VIOLATION',
    'FAIL_FETCH_VIOLATION',
    'RECEIVE_VIOLATION',
    'DELETE_VIOLATIONS',
    'UPDATE_SEARCH_PARAMS'
];

export default createActionTypes(TYPES);