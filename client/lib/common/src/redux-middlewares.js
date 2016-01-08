import {createAction} from 'redux-actions';

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


const COMBINED_ACTION_TYPE = 'COMBINED_ACTION';
function combineActions(action1, action2, combineFn) {
    return function() {
        return {
            type: COMBINED_ACTION_TYPE,
            payload: [action1.apply(null, arguments), action2, combineFn]
        };
    };
}

function combinedActionSupportMiddleware({dispatch}) {
    return next => action => {
        if (action.type !== COMBINED_ACTION_TYPE) {
            next(action);
            return;
        }
        let {payload} = action,
            [action1, action2, combineFn] = payload;
        if (!isPromise(action1.payload)) {
            let actions = combineFn(action1.payload, action2);
            if (_.isArray(actions)) {
                actions.forEach(action => dispatch(action));
            } else {
                dispatch(actions);
            }
        } else {
            action1.payload.then(result => {
                let actions = combineFn(result, action2);
                if (_.isArray(actions)) {
                    actions.forEach(action => dispatch(action));
                } else {
                    dispatch(actions);
                }
            });
        }
    };
}

/**
 * Redux Promise middleware based on redux-promise,
 * but dispatching actions also for failure.
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

/* Does nothing, just invokes the next middleware. */
function reduxIdentityMiddleware({dispatch}) {
    return next => action => next(action);
}

export {
    flummoxCompatWrap,
    combineActions,
    reduxPromiseMiddleware,
    reduxIdentityMiddleware,
    flummoxCompatMiddleware,
    combinedActionSupportMiddleware,
    COMBINED_ACTION_TYPE
}