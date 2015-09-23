/* global ENV_DEVELOPMENT */
import {Actions} from 'flummox';
import request from 'common/src/superagent';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

function _fetchAccounts() {
    return request
        .get(`${ENV_DEVELOPMENT ? 'http://localhost:5005' : ''}/accounts`)
        .accept('json')
        .oauth(Provider, RequestConfig)
        .exec(saveRoute)
        .then(res => res.body);
}

class FullstopActions extends Actions {
    fetchAccounts() {
        return _fetchAccounts();
    }
}

export default FullstopActions;
