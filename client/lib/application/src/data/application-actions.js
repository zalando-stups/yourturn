import {Actions} from 'flummox';
import request from 'common/src/superagent';
import BASE_URL from 'KIO_BASE_URL';

class ApplicationActions extends Actions {
    fetchApplications() {
        return request
                .get(`${BASE_URL}/apps`)
                .set('Accept', 'application/json')
                .exec()
                .then( res => res.body );
    }

    fetchApplication(id) {
        return request
                .get(`${BASE_URL}/apps/${id}`)
                .set('Accept', 'application/json')
                .exec()
                .then( res => res.body )
                .catch( err => {
                    err.id = id;
                    throw err;
                });
    }
}

export default ApplicationActions;