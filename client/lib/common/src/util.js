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

function createActionTypes(types) {
    return types.reduce((obj, t) => {
        obj[t] = t;
        return obj;
    },
    {});
}

function dispatchIn(store, action) {
    return store.dispatch(action);
}

function bindActionsToStore(store, actions) {
    return Object
            .keys(actions)
            .reduce((prev, key) => {
                prev[key] = function() {
                    return dispatchIn(store, actions[key].apply(null, arguments));
                }
                return prev;
            },
            {});
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
    bindActionsToStore
};
