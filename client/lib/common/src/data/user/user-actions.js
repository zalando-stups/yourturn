/* globals Date, Promise, ENV_DEVELOPMENT */
import {Actions} from 'flummox';
import request from 'common/src/superagent';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

class UserActions extends Actions {
    fetchTokenInfo() {
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
                .set('Accept-Encoding', 'gzip')
                .exec()
                .then(res => {
                    let body = res.body;
                    body.valid_until = Date.now() + parseInt(res.body.expires_in, 10) * 1000;
                    return body;
                })
                .catch(err => {
                    if (err.status === 400) {
                        // access token is no longer valid
                        this.deleteTokenInfo();
                        throw err;
                    }
                });
    }

    fetchAccessToken() {
        return request
                .get('does.not.matter')
                .oauth(Provider, RequestConfig)
                .requestAccessToken(saveRoute);
    }

    deleteTokenInfo() {
        Provider.deleteTokens();
        return true;
    }

    fetchUserInfo(userId) {
        return request
                .get(`${ENV_DEVELOPMENT ? 'http://localhost:5009' : ''}/users/${userId}`)
                .accept('json')
                .set('Accept-Encoding', 'gzip')
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then(res => [userId, res.body])
                .catch(e => {
                    e.id = userId;
                    throw e;
                });
    }

    fetchAccounts(userId) {
        return request
                .get(`${ENV_DEVELOPMENT ? 'http://localhost:5005' : ''}/accounts/${userId}`)
                .accept('json')
                .set('Accept-Encoding', 'gzip')
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then(res => res.body)
                .catch(e => {
                    e.id = userId;
                    throw e;
                });
    }
}

export default UserActions;
