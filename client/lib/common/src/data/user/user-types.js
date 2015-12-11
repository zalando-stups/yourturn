import {createActionTypes} from 'common/src/util';

const TYPES = [
    'DELETE_TOKENINFO',
    'FETCH_TOKENINFO',
    'FETCH_ACCOUNTS',
    'FETCH_USERINFO'
];

export default createActionTypes(TYPES);