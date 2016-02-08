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

function handleError(error) {
    this.router.push({
        pathname: '/error',
        state: error
    });
}

function wrapEnter(fetchFn = noop, authFn = noop) {
    return function(routerState, replaceFn, callback) {
        var state = REDUX.getState(),
            fetch = fetchFn(routerState, state, replaceFn);
        Promise
        .resolve(fetch)
        .then(() => {
            let auth = authFn(routerState, state, replaceFn);
            Promise
            .resolve(auth)
            .then(err => {
                if (err) {
                    return callback(err);
                }
                return callback();
            })
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
    wrapEnter,
    handleError
};
