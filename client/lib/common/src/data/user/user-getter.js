import Config from 'common/src/config';

function getUserCloudAccounts(state) {
    return state.get('accounts').toJS();
}

function getUserTeams(state) {
    return state.get('teams').toJS();
}

function getUserInfo(state, user) {
    let info;
    if (user) {
        // specific user
        info = state.getIn(['users', user], false);
    } else {
        // current user
        let {uid} = getTokenInfo(state);
        info = uid ? state.getIn(['users', uid], false) : false;
    }
    return info ? info.toJS() : false; // TODO maybe return undefined here
}

function getTokenInfo(state) {
    let info = state.get('tokeninfo', false);
    return info ? info.toJS() : false;
}

// QUICKFIX #133
function isWhitelisted(state) {
    let token = state.get('tokeninfo').toJS();
    return isTokenWhitelisted(token);
}

function isTokenWhitelisted(token) {
    // ignore whitelist if it's empty
    if (Config.RESOURCE_WHITELIST.length === 0) {
        return true;
    }
    return token && Config.RESOURCE_WHITELIST.indexOf(token.uid) >= 0;
}

export {
    getTokenInfo,
    isWhitelisted,
    isTokenWhitelisted,
    getUserCloudAccounts,
    getUserInfo,
    getUserTeams
};