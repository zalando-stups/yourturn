import _ from 'lodash';
import * as UserGetter from 'common/src/data/user/user-getter';

function requireAccounts(state, userActions) {
    if (!UserGetter.getUserCloudAccounts(state.user).length) {
        let tokeninfo = UserGetter.getTokenInfo(state.user);
        if (!tokeninfo.uid) {
            return userActions
                    .fetchTokenInfo()
                    .then(token => userActions.fetchAccounts(token.uid))
                    .catch(() => userActions.fetchAccessToken());
        }
        return userActions.fetchAccounts(tokeninfo.uid);
    }
    return Promise.resolve(UserGetter.getUserCloudAccounts(state.user));
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
    bindGettersToState
};
