const TYPES = [
    'BEGIN_FETCH_VIOLATIONS',
    'FAIL_FETCH_VIOLATIONS',
    'RECEIVE_VIOLATIONS',
    'BEGIN_FETCH_VIOLATION',
    'FAIL_FETCH_VIOLATION',
    'RECEIVE_VIOLATION',
    'DELETE_VIOLATIONS'
];

export default TYPES.reduce((obj, t) => {
                    obj[t] = t;
                    return obj;
                },
                {});