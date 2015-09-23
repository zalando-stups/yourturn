import {createActionTypes} from 'common/src/util';

const TYPES = [
    'BEGIN_FETCH_SCM_SOURCE',
    'RECEIVE_SCM_SOURCE',
    'FAIL_FETCH_SCM_SOURCE',
    'RECEIVE_TAGS'
];

export default createActionTypes(TYPES);