/* globals Date, Promise */
import {Actions} from 'flummox';
import request from 'common/src/superagent';
import {Provider} from 'common/src/oauth-provider';

class TokeninfoActions extends Actions {
    fetchTokenInfo() {
        let token = Provider.getAccessToken();
        if (!token) {
            return Promise.reject();
        }
        return request
                    .get('/tokeninfo')
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
}

export default TokeninfoActions;