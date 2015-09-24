import {createActionTypes} from 'common/src/util';

const TYPES = [
    'BEGIN_FETCH_OAUTH_CONFIG',
    'FAIL_FETCH_OAUTH_CONFIG',
    'RECEIVE_OAUTH_CONFIG'
];

export default createActionTypes(TYPES);