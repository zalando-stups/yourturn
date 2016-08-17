/* globals Promise */
import REDUX from 'yourturn/src/redux';
import FetchResult from 'common/src/fetch-result';
import * as UserGetter from 'common/src/data/user/user-getter';
import * as MagnificentGetter from 'common/src/data/magnificent/magnificent-getter';

function requireAuth(state, team, magnificentActions) {
    const permitted = MagnificentGetter.getAuth(state.magnificent, team);
    // successful result
    if (!(permitted instanceof FetchResult) && permitted !== null) {
        return Promise.resolve(permitted);
    } else {
        // else fetch
        return magnificentActions.fetchAuth(team)
                    .then(auth => auth.allowed)
                    .catch(() => false);
    }
}

function requireTeams(state, userActions) {
    const userTeams = UserGetter.getUserTeams(state.user);
    if (!userTeams.length) {
        const tokeninfo = UserGetter.getTokenInfo(state.user);
        if (!tokeninfo.uid) {
            return userActions
                    .fetchTokenInfo()
                    .then(token => userActions.fetchTeams(token.uid))
                    .catch(() => userActions.fetchAccessToken());
        }
        return userActions.fetchTeams(tokeninfo.uid);
    }
    return Promise.resolve(userTeams)
}

function requireAccounts(state, userActions) {
    const userAccounts = UserGetter.getUserCloudAccounts(state.user);
    if (!userAccounts.length) {
        const tokeninfo = UserGetter.getTokenInfo(state.user);
        if (!tokeninfo.uid) {
            return userActions
                    .fetchTokenInfo()
                    .then(token => userActions.fetchAccounts(token.uid))
                    .catch(() => userActions.fetchAccessToken());
        }
        return userActions.fetchAccounts(tokeninfo.uid);
    }
    return Promise.resolve(userAccounts);
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
        .then(function() {
            const auth = authFn(routerState, state, ...arguments, replaceFn);
            Promise
            .resolve(auth)
            .then(err => {
                if (err instanceof Error) {
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
    requireAuth,
    wrapEnter,
    handleError,
    requireTeams
};
