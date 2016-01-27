import _ from 'lodash';
import * as UserGetter from 'common/src/data/user/user-getter';
import REDUX from 'yourturn/src/redux';

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
        if (t.startsWith('FETCH_')) {
            obj['BEGIN_' + t] = 'BEGIN_' + t;
            obj['FAIL_' + t] = 'FAIL_' + t;
        }
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

function noop() {};

function wrapEnter(fetchFn = noop, authFn = noop) {
    return function(routerState, replaceStateFn, callback) {
        var state = REDUX.getState(),
            fetch = fetchFn(routerState, state, replaceStateFn);
        Promise
        .resolve(fetch)
        .then(() => {
            let auth = authFn(routerState, state, replaceStateFn);
            Promise
            .resolve(auth)
            .then(() => callback())
            .catch(e => {
                throw e;
            });
        })
        .catch(e => {
            throw e
        });
    }
}

export {
    requireAccounts,
    createActionTypes,
    wrapEnter,
    bindActionsToStore,
    bindGettersToState
};
