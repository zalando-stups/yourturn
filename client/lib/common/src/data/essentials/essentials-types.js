import {createActionTypes} from 'common/src/util';

const TYPES = [
    'FETCH_RESOURCE',
    'BEGIN_FETCH_RESOURCE',
    'FAIL_FETCH_RESOURCE',
    'SAVE_RESOURCE',
    'FETCH_RESOURCES',
    'FETCH_SCOPE',
    'BEGIN_FETCH_SCOPE',
    'FAIL_FETCH_SCOPE',
    'SAVE_SCOPE',
    'FETCH_SCOPES',
    'FETCH_SCOPE_APPLICATIONS'
];

export default createActionTypes(TYPES);