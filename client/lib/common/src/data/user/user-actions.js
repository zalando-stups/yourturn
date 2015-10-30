/* globals Date, Promise */
import {Actions} from 'flummox';
import request from 'common/src/superagent';
import USER_BASE_URL from 'USER_BASE_URL';
import OAUTH_TOKENINFO_URL from 'OAUTH_TOKENINFO_URL';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

function fetchTokenInfo() {
    let token = Provider.getAccessToken();
    if (!token) {
        return Promise.reject();
    }
    return request
            .get(`${OAUTH_TOKENINFO_URL}`)
            .query({
                access_token: token
            })
            .accept('json')
            .exec()
            .then(res => {
                let body = res.body;
                body.valid_until = Date.now() + parseInt(res.body.expires_in, 10) * 1000;
                return body;
            })
            .catch(err => {
                if (err.status === 400) {
                    // access token is no longer valid
                    deleteTokenInfo();
                    throw err;
                }
            });
}

function deleteTokenInfo() {
    Provider.deleteTokens();
    return true;
}

function fetchAccessToken() {
    return request
            .get('does.not.matter')
            .oauth(Provider, RequestConfig)
            .requestAccessToken(saveRoute);
}

function fetchUserInfo(userId) {
    return request
            .get(`${USER_BASE_URL}/users/${userId}`)
            .accept('json')
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => [userId, res.body])
            .catch(e => {
                e.id = userId;
                throw e;
            });
}

function fetchAccounts(userId) {
    return request
            .get(`${USER_BASE_URL}/accounts/${userId}`)
            .accept('json')
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => res.body)
            .catch(e => {
                e.id = userId;
                throw e;
            });
}

class UserActions extends Actions {
    fetchTokenInfo() {
        return fetchTokenInfo();
    }

    fetchAccessToken() {
        return fetchAccessToken();
    }

    deleteTokenInfo() {
        return deleteTokenInfo();
    }

    fetchUserInfo(userId) {
        return fetchUserInfo(userId);
    }

    fetchAccounts(userId) {
        return fetchAccounts(userId);
    }
}

export default UserActions;

export {
    fetchTokenInfo as fetchTokenInfo,
    fetchAccessToken as fetchAccessToken,
    deleteTokenInfo as deleteTokenInfo,
    fetchUserInfo as fetchUserInfo,
    fetchAccounts as fetchAccounts
};