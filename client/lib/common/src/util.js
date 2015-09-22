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

export {
    requireAccounts as requireAccounts,
    createActionTypes as createActionTypes
};
