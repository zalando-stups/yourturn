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
    'FETCH_APPROVAL_TYPES'
];

export default createActionTypes(TYPES);