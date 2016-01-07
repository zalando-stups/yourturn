import {createActionTypes} from 'common/src/util';

const TYPES = [
    'FETCH_SEARCH_RESULTS',
    'CLEAR_SEARCH_RESULTS'
];

export default createActionTypes(TYPES);