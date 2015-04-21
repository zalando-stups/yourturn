import {Actions} from 'flummox';

class ResourceActions extends Actions {

    addResource(resource) {
        return resource;
    }

    addScope(resource, scope) {
        return [resource, scope];
    }
}

export default ResourceActions;