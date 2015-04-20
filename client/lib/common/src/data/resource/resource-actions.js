import {Actions} from 'flummox';

class ResourceActions extends Actions {

    addResource(resource) {
        return resource;
    }

    addScope(resource, name) {
        return [resource, name];
    }
}

export default ResourceActions;