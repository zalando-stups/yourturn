import {Actions} from 'flummox';
import request from 'common/src/superagent';

class TokeninfoActions extends Actions {
    fetchTokenInfo(token) {
        return request
                    .get('/tokeninfo')
                    .query({
                        access_token: token
                    })
                    .accept('json')
                    .exec()
                    .then(res => [token, res.body]);
    }
}

export default TokeninfoActions;