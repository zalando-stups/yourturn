import {Actions} from 'flummox';
import request from 'common/src/superagent';
import {Services} from 'common/src/data/services';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

class ResourceActions extends Actions {

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

    // ===== LOCAL STORAGE BELOW ====

    saveResource(resource) {
        return request
                .put(`${Services.essentials.url}${Services.essentials.root}/${resource.id}`)
                .type('json')
                .accept('json')
                .oauth(Provider, RequestConfig)
                .send(resource)
                .exec(saveRoute)
                .catch( err => {
                    err.id = resource.id;
                    throw err;
                });
    }

    saveScope(resourceId, scope) {
        return request
                .put(`${Services.essentials.url}${Services.essentials.root}/${resourceId}/scopes/${scope.id}`)
                .type('json')
                .accept('json')
                .oauth(Provider, RequestConfig)
                .send(scope)
                .exec(saveRoute)
                .catch( err => {
                    err.id = scope.id;
                    throw err;
                });
    }

    fetchResource(resourceId) {
        return request
                .get(`${Services.essentials.url}${Services.essentials.root}/${resourceId}`)
                .accept('json')
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then( res => res.body )
                .catch( err => {
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
                .then( res => res.body );
    }

    fetchScope(resourceId, scopeId) {
        return request
                .get(`${Services.essentials.url}${Services.essentials.root}/${resourceId}/scopes/${scopeId}`)
                .accept('json')
                .oauth(Provider, RequestConfig)
                .exec(saveRoute)
                .then( res => [resourceId, res.body] )
                .catch( err => {
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
                .then( res => [`${resourceId}.${scopeId}`, res.body] )
                .catch( err => {
                    err.id = resourceId;
                    throw err;
                });
    }

}

export default ResourceActions;
