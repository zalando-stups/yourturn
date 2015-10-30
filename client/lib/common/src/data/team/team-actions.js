import {Actions} from 'flummox';
import TEAM_BASE_URL from 'TEAM_BASE_URL';
import request from 'common/src/superagent';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

function fetchAccounts() {
    return request
        .get(`${TEAM_BASE_URL}/accounts`)
        .accept('json')
        .oauth(Provider, RequestConfig)
        .exec(saveRoute)
        .then(res => res.body);
}

class FullstopActions extends Actions {
    fetchAccounts() {
        return fetchAccounts();
    }
}

export default FullstopActions;

export {
    fetchAccounts as fetchAccounts
};