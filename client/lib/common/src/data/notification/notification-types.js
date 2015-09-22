const TYPES = [
    'ADD_NOTIFICATION',
    'REMOVE_NOTIFICATION',
    'REMOVE_NOTIFICATIONS_OLDER_THAN'
];

export default TYPES.reduce((obj, t) => {
    obj[t] = t;
    return obj;
}, {});