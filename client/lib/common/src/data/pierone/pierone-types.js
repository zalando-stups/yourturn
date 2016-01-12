import {createActionTypes} from 'common/src/util';

const TYPES = [
    'FETCH_SCM_SOURCE',
    'FETCH_TAGS'
];

export default createActionTypes(TYPES);