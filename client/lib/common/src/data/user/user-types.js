import {createActionTypes} from 'common/src/util';

const TYPES = [
    'DELETE_TOKENINFO',
    'FETCH_TOKENINFO',
    'FETCH_USERACCOUNTS',
    'FETCH_USERINFO'
];

export default createActionTypes(TYPES);