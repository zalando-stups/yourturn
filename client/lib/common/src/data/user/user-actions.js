/* globals Date, Promise */
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
                    .get('http://localhost:8080/tokeninfo')
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
                            this.deleteTokenInfo();
                            throw err;
                        }
                    });
    }

    deleteTokenInfo() {
        Provider.deleteTokens();
        return true;
    }

    fetchUserTeams(userId) {
        return request
                    .get(`http://localhost:8080/user/${userId}`)
                    .accept('json')
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