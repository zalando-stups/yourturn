/** global window **/
import {Actions} from 'flummox';
let {localStorage} = window;

class ResourceActions extends Actions {

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

    fetchScopes(resourceId) {
        let scopes = Object
                        .keys(localStorage)
                        .filter(key => key.startsWith(`resource.${resourceId}`))
                        .filter(key => key.split('.').length === 3)
                        .map(key => JSON.parse(localStorage.getItem(key)));
        return [resourceId, scopes];
    }

    fetchScope(resourceId, scopeId) {
        let scope = JSON.parse(localStorage.getItem(`resource.${resourceId}.${scopeId}`));
        return [resourceId, scope];
    }
}

export default ResourceActions;