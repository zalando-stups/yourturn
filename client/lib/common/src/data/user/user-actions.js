/* globals Date, Promise, ENV_DEVELOPMENT */
import request from 'common/src/superagent';
import {createAction} from 'redux-actions';
import {flummoxCompatWrap} from 'common/src/redux-middlewares';
import Type from './user-types';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

function fetchTokenInfo() {
    let token = Provider.getAccessToken();
    if (!token) {
        return Promise.reject();
    }
    return request
            .get(`${ENV_DEVELOPMENT ? 'http://localhost:5006' : ''}/tokeninfo`)
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
            .get(`${ENV_DEVELOPMENT ? 'http://localhost:5009' : ''}/users/${userId}`)
            .accept('json')
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => [userId, res.body])
            .catch(e => {
                e.id = userId;
                throw e;
            });
}

function fetchTeams(userId) {
    return request
            .get(`${ENV_DEVELOPMENT ? 'http://localhost:5005' : ''}/users/${userId}/teams`)
            .accept('json')
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(({body}) => body)
            .catch(e => {
                e.id = userId;
                throw e;
            });
}

function fetchAccounts(userId) {
    return request
            .get(`${ENV_DEVELOPMENT ? 'http://localhost:5005' : ''}/users/${userId}/accounts`)
            .accept('json')
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => res.body)
            .catch(e => {
                e.id = userId;
                throw e;
            });
}

let fetchInfoAction = createAction(Type.FETCH_TOKENINFO, fetchTokenInfo),
    deleteTokenAction = createAction(Type.DELETE_TOKENINFO, deleteTokenInfo),
    fetchUserAction = createAction(Type.FETCH_USERINFO, fetchUserInfo),
    fetchAccountsAction = createAction(Type.FETCH_USERACCOUNTS, fetchAccounts),
    fetchTeamsAction = createAction(Type.FETCH_USERTEAMS, fetchTeams);

export {
    fetchAccessToken,
    fetchInfoAction as fetchTokenInfo,
    deleteTokenAction as deleteTokenInfo,
    fetchUserAction as fetchUserInfo,
    fetchAccountsAction as fetchAccounts,
    fetchTeamsAction as fetchTeams
};
