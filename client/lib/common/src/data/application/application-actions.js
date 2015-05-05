import {Actions} from 'flummox';
import request from 'common/src/superagent';
import {Services} from 'common/src/data/services';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

class ApplicationActions extends Actions {
    fetchApplications() {
        return request
                .get(`${Services.kio.url}${Services.kio.root}`)
                .accept('json')
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then( res => res.body );
    }

    fetchApplication(id) {
        return request
                .get(`${Services.kio.url}${Services.kio.root}/${id}`)
                .accept('json')
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then( res => res.body )
                .catch( err => {
                    err.id = id;
                    throw err;
                });
    }

    saveApplication(id, app) {
        return request
                .put(`${Services.kio.url}${Services.kio.root}/${id}`)
                .type('json')
                .accept('json')
                .send(app)
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then()
                .catch( err => {
                    err.id = id;
                    throw err;
                });
    }

    fetchApplicationVersions(id) {
        return request
                .get(`${Services.kio.url}${Services.kio.root}/${id}/versions`)
                .accept('json')
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then( res => res.body )
                .catch( err => {
                    err.id = id;
                    throw err;
                });
    }

    fetchApplicationVersion(id, ver) {
        return request
                .get(`${Services.kio.url}${Services.kio.root}/${id}/versions/${ver}`)
                .accept('json')
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then( res => res.body )
                .catch( err => {
                    err.id = id;
                    err.ver = ver;
                    throw err;
                });
    }

    saveApplicationVersion(version) {
        return request
                .put(`${Services.kio.url}${Services.kio.root}/${version.application_id}/versions/${version.id}`)
                .type('json')
                .accept('json')
                .send(version)
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then()
                .catch(err => {
                    err.applicationId = version.application_id;
                    err.version_id = version.id;
                    throw err;
                });
    };

    fetchApprovals(applicationId, versionId) {
        return request
                .get(`${Services.kio.url}${Services.kio.root}/${applicationId}/versions/${versionId}/approvals`)
                .accept('json')
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then(res => res.body)
                .catch(err => {
                    err.applicationId = applicationId;
                    err.versionId = versionId;
                    throw err;
                });
    }

    saveApproval(approval) {
        return request
                .post(`${Services.kio.url}${Services.kio.root}/${approval.application_id}/versions/${approval.version_id}/approvals`)
                .type('json')
                .accept('json')
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then();
    }
}

export default ApplicationActions;
