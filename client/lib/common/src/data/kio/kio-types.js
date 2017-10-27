import {createActionTypes} from 'common/src/util';

const TYPES = [
    'FETCH_APPLICATIONS',
    'FETCH_APPLICATION',
    'SAVE_APPLICATION',
    'LOAD_PREFERRED_ACCOUNT',
    'SAVE_PREFERRED_ACCOUNT',
    'LOAD_TAB_ACCOUNTS',
    'SAVE_TAB_ACCOUNTS'
];

export default createActionTypes(TYPES);
