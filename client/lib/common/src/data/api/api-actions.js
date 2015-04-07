import {Actions} from 'flummox';
import request from 'common/src/superagent';
import BASE_URL from 'TWINTIP_BASE_URL';

class ApiActions extends Actions {
    fetchApi(id) {
        return request
                .get(`${BASE_URL}/apis/${id}`)
                .set('Accept', 'application/json')
                .exec()
                .then( res => res.body )
                .catch( err => {
                    err.id = id;
                    throw err;
                });
    }
}

export default ApiActions;