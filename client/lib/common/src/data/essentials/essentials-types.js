import {createActionTypes} from 'common/src/util';

const TYPES = [
    'BEGIN_FETCH_RESOURCE',
    'FAIL_FETCH_RESOURCE',
    'RECEIVE_RESOURCE',

    'RECEIVE_RESOURCES',

    'BEGIN_FETCH_SCOPE',
    'FAIL_FETCH_SCOPE',
    'RECEIVE_SCOPE',

    'RECEIVE_SCOPES',
    'RECEIVE_SCOPE_APPLICATIONS'
];

export default createActionTypes(TYPES);