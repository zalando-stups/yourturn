import {Actions} from 'flummox';
import request from 'common/src/superagent';
import OAUTH_TOKENINFO_URL from 'OAUTH_TOKENINFO_URL';

class TokeninfoActions extends Actions {
    fetchTokenInfo(token) {
        return request
                    .get(OAUTH_TOKENINFO_URL)
                    .query({
                        access_token: token
                    })
                    .accept('json')
                    .exec()
                    .then(res => [token, res.body]);
    }
}

export default TokeninfoActions;