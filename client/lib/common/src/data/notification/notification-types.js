import {createActionTypes} from 'common/src/util';

const TYPES = [
    'ADD_NOTIFICATION',
    'REMOVE_NOTIFICATION',
    'REMOVE_NOTIFICATIONS_OLDER_THAN'
];
//TODO undefined in tests
console.log(createActionTypes);
export default createActionTypes(TYPES);