/* global ENV_DEVELOPMENT */
import {Actions} from 'flummox';
import request from 'common/src/superagent';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

class FullstopActions extends Actions {
    fetchAccounts() {
        return request
                .get(`${ENV_DEVELOPMENT ? 'http://localhost:5005' : ''}/accounts`)
                .accept('json')
                .set('Accept-Encoding', 'gzip')
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then(res => res.body);
    }
}

export default FullstopActions;
