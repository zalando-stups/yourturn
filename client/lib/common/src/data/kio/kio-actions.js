import _ from 'lodash';
import {Actions} from 'flummox';
import request from 'common/src/superagent';
import {Services} from 'common/src/data/services';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

class KioActions extends Actions {
    fetchApplications() {
        return request
                .get(`${Services.kio.url}${Services.kio.root}`)
                .accept('json')
                .set('Accept-Encoding', 'gzip')
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then(res => res.body);
    }

    fetchApplication(id) {
        return request
                .get(`${Services.kio.url}${Services.kio.root}/${id}`)
                .accept('json')
                .set('Accept-Encoding', 'gzip')
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then(res => res.body)
                .catch(err => {
                    err.id = id;
                    throw err;
                });
    }

    saveApplication(id, app) {
        let copy = _.extend({}, app);
        // remove fields not liked by kio
        copy.id = undefined;
        copy.created = undefined;
        copy.created_by = undefined;
        copy.last_modified = undefined;
        copy.last_modified_by = undefined;
        return request
                .put(`${Services.kio.url}${Services.kio.root}/${id}`)
                .type('json')
                .accept('json')
                .set('Accept-Encoding', 'gzip')
                .send(copy)
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then(res => res.body)
                .catch(err => {
                    err.id = id;
                    throw err;
                });
    }

    fetchApplicationVersions(id) {
        return request
                .get(`${Services.kio.url}${Services.kio.root}/${id}/versions`)
                .accept('json')
                .set('Accept-Encoding', 'gzip')
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then(res => res.body)
                .catch(err => {
                    err.id = id;
                    throw err;
                });
    }

    fetchApplicationVersion(id, ver) {
        return request
                .get(`${Services.kio.url}${Services.kio.root}/${id}/versions/${ver}`)
                .accept('json')
                .set('Accept-Encoding', 'gzip')
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then(res => res.body)
                .catch(err => {
                    err.id = id;
                    err.ver = ver;
                    throw err;
                });
    }

    saveApplicationVersion(applicationId, versionId, version) {
        let copy = _.extend({}, version);
        copy.id = undefined;
        return request
                .put(`${Services.kio.url}${Services.kio.root}/${applicationId}/versions/${versionId}`)
                .type('json')
                .accept('json')
                .set('Accept-Encoding', 'gzip')
                .send(copy)
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then(res => res.body)
                .catch(err => {
                    err.applicationId = applicationId;
                    err.versionId = versionId;
                    throw err;
                });
    };

    fetchApprovalTypes(applicationId) {
        return request
                .get(`${Services.kio.url}${Services.kio.root}/${applicationId}/approvals`)
                .accept('json')
                .set('Accept-Encoding', 'gzip')
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then(res => [
                    applicationId,
                    // specification, test, deploy and code change always have to be there
                    (res.body.concat(['SPECIFICATION', 'TEST', 'DEPLOY', 'CODE_CHANGE']))
                        .filter((i, idx, arr) => arr.lastIndexOf(i) === idx)
                        .sort()
                ])
                .catch(err => {
                    err.applicationId = applicationId;
                    throw err;
                });
    }

    fetchApprovals(applicationId, versionId) {
        return request
                .get(`${Services.kio.url}${Services.kio.root}/${applicationId}/versions/${versionId}/approvals`)
                .accept('json')
                .set('Accept-Encoding', 'gzip')
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then(res => [applicationId, versionId, res.body])
                .catch(err => {
                    err.applicationId = applicationId;
                    err.versionId = versionId;
                    throw err;
                });
    }

    saveApproval(applicationId, versionId, approval) {
        return request
                .post(`${Services.kio.url}${Services.kio.root}/${applicationId}/versions/${versionId}/approvals`)
                .type('json')
                .accept('json')
                .set('Accept-Encoding', 'gzip')
                .send(approval)
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then(res => res.body)
                .catch(err => {
                    err.applicationId = applicationId;
                    err.versionId = versionId;
                    throw err;
                });
    }
}

export default KioActions;
