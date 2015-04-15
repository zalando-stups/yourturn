import {Actions} from 'flummox';
import request from 'common/src/superagent';
import {Services} from 'common/src/data/services';
import {Provider, RequestConfig} from 'common/src/oauth-provider';

class ApplicationActions extends Actions {
    fetchApplications() {
        return request
                .get(`${Services.kio.url}${Services.kio.root}`)
                .accept('json')
                .oauth(Provider, RequestConfig)
                .exec(req => {
                    req.metadata.route = window.location.pathname;
                })
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
}

export default ApplicationActions;