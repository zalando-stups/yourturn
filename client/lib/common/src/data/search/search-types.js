import {createActionTypes} from 'common/src/util';

const TYPES = [
    'RECEIVE_SEARCH_RESULTS',
    'CLEAR_SEARCH_RESULTS'
];

export default createActionTypes(TYPES);