import {Actions} from 'flummox';
import request from 'common/src/superagent';
import {Services} from 'common/src/data/services';

class ApiActions extends Actions {
    fetchApi(id) {
        return request
                .get(`${Services.twintip.url}${Services.twintip.root}/${id}`)
                .accept('json')
                .exec()
                .then( res => res.body )
                .catch( err => {
                    err.id = id;
                    throw err;
                });
    }
}

export default ApiActions;