import _ from 'lodash';
import {Actions} from 'flummox';
import request from 'common/src/superagent';
import {Services} from 'common/src/data/services';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

class EssentialsActions extends Actions {

    fetchAllScopes() {
        return request
                .get(`${Services.essentials.url}${Services.essentials.root}`)
                .accept('json')
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then(response => Promise.all(response.body.map(res => this.fetchScopes(res.id))));
    }

    fetchScopes(resourceId) {
        return request
                .get(`${Services.essentials.url}${Services.essentials.root}/${resourceId}/scopes`)
                .accept('json')
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then(res => [resourceId, res.body]);
    }

    saveResource(resourceId, resource) {
        let copy = _.extend({}, resource);
        copy.id = undefined;
        return request
                .put(`${Services.essentials.url}${Services.essentials.root}/${resourceId}`)
                .type('json')
                .accept('json')
                .oauth(Provider, RequestConfig)
                .send(copy)
                .exec(saveRoute)
                .catch(err => {
                    err.id = resourceId;
                    throw err;
                });
    }

    saveScope(resourceId, scopeId, scope) {
        let copy = _.extend({}, scope);
        copy.id = undefined;
        return request
                .put(`${Services.essentials.url}${Services.essentials.root}/${resourceId}/scopes/${scopeId}`)
                .type('json')
                .accept('json')
                .oauth(Provider, RequestConfig)
                .send(copy)
                .exec(saveRoute)
                .catch(err => {
                    err.id = scopeId;
                    throw err;
                });
    }

    fetchResource(resourceId) {
        return request
                .get(`${Services.essentials.url}${Services.essentials.root}/${resourceId}`)
                .accept('json')
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then(res => res.body)
                .catch(err => {
                    err.id = resourceId;
                    throw err;
                });
    }

    fetchResources() {
        return request
                .get(`${Services.essentials.url}${Services.essentials.root}`)
                .accept('json')
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then(res => res.body);
    }

    fetchScope(resourceId, scopeId) {
        return request
                .get(`${Services.essentials.url}${Services.essentials.root}/${resourceId}/scopes/${scopeId}`)
                .accept('json')
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then(res => [resourceId, res.body])
                .catch(err => {
                    err.id = resourceId;
                    throw err;
                });
    }

    fetchScopeApplications(resourceId, scopeId) {
        return request
                .get(`${Services.mint.url}${Services.mint.root}`)
                .query({
                    resource_type_id: resourceId,
                    scope_id: scopeId
                })
                .accept('json')
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then(res => [resourceId, scopeId, res.body])
                .catch(err => {
                    err.id = resourceId;
                    throw err;
                });
    }

}

export default EssentialsActions;
