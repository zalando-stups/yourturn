import {createActionTypes} from 'common/src/util';

const TYPES = [
    'DELETE_TOKENINFO',
    'FETCH_TOKENINFO',
    'FETCH_USERACCOUNTS',
    'FETCH_USERINFO',
    'FETCH_USERTEAMS'
];

export default createActionTypes(TYPES);