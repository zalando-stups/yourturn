import {Actions} from 'flummox';
import request from 'common/src/superagent';

/**
 * list = get all there is
 * get = get single
 */
export default class ApplicationActions extends Actions {
    getApplication(id) {
        return request
                .get(`http://localhost:5000/applications/${id}`)
                .set('Accept', 'application/json')
                .exec()
                .then( res => res.body );
    }

    getApplications() {
        return request
                .get('http://localhost:5000/applications')
                .set('Accept', 'application/json')
                .exec()
                .then( res => res.body );
    }
}