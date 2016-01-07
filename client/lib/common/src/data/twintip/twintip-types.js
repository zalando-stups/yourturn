import {createActionTypes} from 'common/src/util';

const TYPES = [
    'FETCH_API',
    'FAIL_FETCH_API',
    'BEGIN_FETCH_API'
];

export default createActionTypes(TYPES);