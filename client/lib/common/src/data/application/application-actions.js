import {Actions} from 'flummox';
import request from 'common/src/superagent';
import {Services} from 'common/src/data/services';
// import {Provider, RequestConfig} from 'common/src/oauth-provider';

class ApplicationActions extends Actions {
    fetchApplications() {
        return request
                .get(`${Services.kio.url}${Services.kio.root}`)
                .accept('json')
                .exec()
                .then( res => res.body );
    }

    fetchApplication(id) {
        return request
                .get(`${Services.kio.url}${Services.kio.root}/${id}`)
                .accept('json')
                .exec()
                .then( res => res.body )
                .catch( err => {
                    err.id = id;
                    throw err;
                });
    }

    saveApplication(app) {
        return request
                .put(`${Services.kio.url}${Services.kio.root}/${app.id}`)
                .type('json')
                .accept('json')
                .send(app)
                .exec()
                .then( res => res.body )
                .catch( err => {
                    err.id = app.id;
                    throw err;
                });
    }
}

export default ApplicationActions;