/** global window **/
import {Actions} from 'flummox';
let {localStorage} = window;
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
        localStorage.setItem(`resource.${resource.id}`, JSON.stringify(resource));
        return resource;
    }

    saveScope(resourceId, scope) {
        localStorage.setItem(`resource.${resourceId}.${scope.id}`, JSON.stringify(scope));
        return [resourceId, scope];
    }

    fetchResource(resourceId) {
        return JSON.parse(localStorage.getItem(`resource.${resourceId}`));
    }

    fetchResources() {
        return Object
                .keys(localStorage)
                .filter(key => key.startsWith('resource'))
                .filter(key => key.split('.').length === 2)
                .map(key => JSON.parse(localStorage.getItem(key)));
    }

    fetchScope(resourceId, scopeId) {
        let scope = JSON.parse(localStorage.getItem(`resource.${resourceId}.${scopeId}`));
        return [resourceId, scope];
    }
}

export default ResourceActions;