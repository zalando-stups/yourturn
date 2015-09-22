import {createActionTypes} from 'common/src/util';

const TYPES = [
    'DELETE_TOKENINFO',
    'RECEIVE_TOKENINFO',
    'RECEIVE_ACCOUNTS',
    'RECEIVE_USERINFO'
];

export default createActionTypes(TYPES);