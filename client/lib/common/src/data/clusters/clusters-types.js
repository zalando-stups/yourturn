import {createActionTypes} from 'common/src/util';

const TYPES = [
    'FETCH_CLUSTERS',
    'FAIL_FETCH_CLUSTERS',
    'BEGIN_FETCH_CLUSTERS'
];

export default createActionTypes(TYPES);