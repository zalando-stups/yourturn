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

function noop() {
    // does nothing
}

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
    wrapEnter
};
