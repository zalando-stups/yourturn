import {Actions} from 'flummox';

class ResourceActions extends Actions {

    saveResource(resource) {
        return resource;
    }

    saveScope(resource, scope) {
        return [resource, scope];
    }
}

export default ResourceActions;