import {createAction} from 'redux-actions';

function requireAccounts(flux) {
    const ACTIONS = flux.getActions('user'),
          STORE = flux.getStore('user');
    if (!STORE.getUserCloudAccounts().length) {
        let tokeninfo = STORE.getTokenInfo();
        if (!tokeninfo.uid) {
            return ACTIONS
                    .fetchTokenInfo()
                    .then(token => ACTIONS.fetchAccounts(token.uid))
                    .catch(() => ACTIONS.fetchAccessToken());
        }
        return ACTIONS.fetchAccounts(tokeninfo.uid);
    }
    return Promise.resolve(STORE.getUserCloudAccounts());
}

function bindGettersToState(state, getters) {
    return Object
            .keys(getters)
            .reduce((prev, key) => {
                prev[key] = function() {
                    let args = [state, ...arguments];
                    return getters[key].apply(null, args);
                };
                return prev;
            },
            {});
}

function createActionTypes(types) {
    return types.reduce((obj, t) => {
        obj[t] = t;
        return obj;
    },
    {});
}

function bindActionsToStore(store, actions) {
    return Object
            .keys(actions)
            .reduce((prev, key) => {
                prev[key] = function() {
                    let action = actions[key].apply(null, arguments);
                    store.dispatch(action);
                    return action.payload;
                }
                return prev;
            },
            {});
}

function isPromise(maybePromise) {
    return maybePromise && typeof maybePromise.then === 'function';
}

function isFSA(action) {
    return !!action.type && !!action.payload;
}

var flummoxCompatAction = createAction('FLUMMOX_COMPAT', function(action, ...args) {
    let a = action.apply(null, args),
        p = Promise.resolve(a.payload),
        r = [a, ...args];
    p._meta = r;
    return p;
});

function flummoxCompatWrap(action) {
    return flummoxCompatAction.bind(null, action);
}

// takes a description from an action
// and dispatches it
function flummoxCompatMiddleware({dispatch}) {
    return next => action => {
        if (action.type !== 'FLUMMOX_COMPAT') {
            return next(action);
        }
        // get the actual action and the arguments it was called with
        let [actualAction, ...args] = action.payload._meta;
        // dispatch a begin_ action
        dispatch({
            type: 'BEGIN_' + actualAction.type,
            payload: args
        });
        next(actualAction);
    };
}

/**
 * Redux Promise middleware based on redux-promise,
 * but dispatching actions also for begin.
 */
function reduxPromiseMiddleware({dispatch}) {
    return next => action => {

        if (!isFSA(action)) {
            return isPromise(action) ?
                    action.then(dispatch) :
                    next(action)
        }

        if (isPromise(action.payload)) {
            return action.payload.then(
                result => dispatch({
                    ...action,
                    payload: result
                }),
                error => dispatch({
                    ...action,
                    type: 'FAIL_' + action.type,
                    payload: error,
                    error: true
                })
            );
        } else {
            next(action);
        }
    };
}

function merge(dest, src) {
    let result = dest || {};
    Object
    .keys(src)
    .forEach(k => {
        result[k] = src[k];
    });

    return result;
}

export {
    requireAccounts,
    createActionTypes,
    merge,
    bindActionsToStore,
    reduxPromiseMiddleware,
    flummoxCompatMiddleware,
    bindGettersToState,
    flummoxCompatWrap
};
