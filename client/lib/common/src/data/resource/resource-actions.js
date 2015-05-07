/** global window **/
import {Actions} from 'flummox';
let {localStorage} = window;
import request from 'common/src/superagent';
import {Services} from 'common/src/data/services';

class ResourceActions extends Actions {

    saveResource(resource) {
        return request
                .put(`${Services.essentials.url}${Services.essentials.root}/${resource.id}`)
                .type('json')
                .accept('json')
                .send(resource)
                .exec()
                .then()
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
                .send(scope)
                .exec()
                .then( [resourceId, scope] )
                .catch( err => {
                    err.id = scope.id;
                    throw err;
                });
    }

    fetchResource(resourceId) {
        return request
                .get(`${Services.essentials.url}${Services.essentials.root}/${resourceId}`)
                .accept('json')
                .exec()
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
                .exec()
                .then( res => res.body );
    }

    fetchAllScopes() {
        let scopes = Object
                        .keys(localStorage)
                        .filter(key => key.startsWith('resource'))
                        .filter(key => key.split('.').length === 3)
                        .map(key => {
                            let val = JSON.parse(localStorage.getItem(key));
                            val.resourceId = key.split('.')[1];
                            return val;
                        });
        return scopes;
    }

    fetchScopes(resourceId) {
        return request
                .get(`${Services.essentials.url}${Services.essentials.root}/${resourceId}/scopes`)
                .accept('json')
                .exec()
                .then( res => [resourceId, res.body] );
    }

    fetchScope(resourceId, scopeId) {
        return request
                .get(`${Services.essentials.url}${Services.essentials.root}/${resourceId}/scopes/${scopeId}`)
                .accept('json')
                .exec()
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
                .exec()
                .then( res => [`${resourceId}.${scopeId}`, res.body] );
    }

}

export default ResourceActions;
