import {Store} from 'flummox';
import _m from 'mori';

class ResourceStore extends Store {
    constructor(flux) {
        super();

        const resourceActions = flux.getActions('resource');

        this.state = {
            resources: _m.hashMap()
        };

        this.register(
            resourceActions.addResource,
            this.receiveResource);
        this.register(
            resourceActions.addScope,
            this.receiveScope);
    }

    receiveResource(resource) {
        this.setState({
            resources: _m.assoc(this.state.resources, resource.id, _m.hashMap())
        });
    }

    getResources() {
        let entries = _m.keys(this.state.resources);
        return entries ? _m.toJs(entries) : [];
    }

    getScopes(resource) {
        let entries = _m.keys(_m.get(this.state.resources, resource));
        return entries ? _m.toJs(entries) : {};
    }

    receiveScope([resource, name]) {
        let scopes = _m.get(this.state.resources, resource);
        scopes = _m.assoc(scopes, name, true);
        this.setState({
            resources: _m.assoc(this.state.resources, resource, scopes)
        });
    }
}

export default ResourceStore;