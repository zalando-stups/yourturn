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
        if (t.startsWith('FETCH_')) {
            obj['BEGIN_' + t] = 'BEGIN_' + t;
            obj['FAIL_' + t] = 'FAIL_' + t;
        }
        return obj;
    },
    {});
}

/**
 * DEPRECATED, use bindActionCreators from redux instead
 */
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

export {
    createActionTypes,
    bindActionsToStore,
    bindGettersToState
};
