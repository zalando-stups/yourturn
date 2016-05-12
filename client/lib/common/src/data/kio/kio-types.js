import {createActionTypes} from 'common/src/util';

const TYPES = [
    'FETCH_APPLICATIONS',
    'FETCH_APPLICATION',
    'SAVE_APPLICATION',
    'FETCH_APPLICATION_VERSIONS',
    'FETCH_APPLICATION_VERSION',
    'SAVE_APPLICATION_VERSION',
    'FETCH_APPROVALS',
    'SAVE_APPROVAL',
    'FETCH_APPROVAL_TYPES',
    'LOAD_PREFERRED_ACCOUNT',
    'SAVE_PREFERRED_ACCOUNT',
    'LOAD_TAB_ACCOUNTS',
    'SAVE_TAB_ACCOUNTS'
];

export default createActionTypes(TYPES);