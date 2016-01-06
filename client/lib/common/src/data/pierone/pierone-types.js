import {createActionTypes} from 'common/src/util';

const TYPES = [
    'BEGIN_FETCH_SCM_SOURCE',
    'FETCH_SCM_SOURCE',
    'FAIL_FETCH_SCM_SOURCE',
    'FETCH_TAGS'
];

export default createActionTypes(TYPES);