import {Actions} from 'flummox';
import request from 'common/src/superagent';

class ApplicationActions extends Actions {
    fetchApplications() {
        return request
                .get('http://localhost:5000/applications')
                .set('Accept', 'application/json')
                .exec()
                .then( res => res.body )
                .catch( err => {
                    throw err;
                });
    }

    fetchApplication(id) {
        return request
                .get('http://localhost:5000/applications/' + id)
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