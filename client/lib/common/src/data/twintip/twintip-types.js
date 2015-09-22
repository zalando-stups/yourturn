import {createActionTypes} from 'common/src/util';

const TYPES = [
    'BEGIN_FETCH_API',
    'RECEIVE_API',
    'FAIL_FETCH_API'
];

export default createActionTypes(TYPES);