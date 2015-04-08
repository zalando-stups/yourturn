import {Actions} from 'flummox';
import request from 'common/src/superagent';
import {Services} from 'common/src/data/services';

class ApplicationActions extends Actions {
    fetchApplications() {
        return request
                .get(`${Services.kio.url}${Services.kio.root}`)
                .set('Accept', 'application/json')
                .exec()
                .then( res => res.body );
    }

    fetchApplication(id) {
        return request
                .get(`${Services.kio.url}${Services.kio.root}/${id}`)
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