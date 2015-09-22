import {Actions} from 'flummox';
import request from 'common/src/superagent';
import {Services} from 'common/src/data/services';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

function _fetchApi(id) {
    return request
        .get(`${Services.twintip.url}${Services.twintip.root}/${id}`)
        .accept('json')
        .oauth(Provider, RequestConfig)
        .exec(saveRoute)
        .then(res => res.body)
        .catch(err => {
            err.id = id;
            throw err;
        });
}

class TwintipActions extends Actions {
    fetchApi(id) {
        return _fetchApi(id);
    }
}

export default TwintipActions;