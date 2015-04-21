import {Store} from 'flummox';
import _m from 'mori';

class ResourceStore extends Store {
    constructor(flux) {
        super();

        const resourceActions = flux.getActions('resource');

        this.state = {
            resources: _m.hashMap(),
            scopes: _m.hashMap()
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
            resources: _m.assoc(this.state.resources, resource.id, _m.toClj(resource))
        });
    }

    getResource(resourceId) {
        let resource = _m.get(this.state.resources, resourceId);
        return resource ? _m.toJs(resource) : false;
    }

    getResources() {
        let entries = _m.keys(this.state.resources);
        return entries ? _m.toJs(entries) : [];
    }

    getScope(resourceId, scopeId) {
        let scopes = _m.get(this.state.scopes, resourceId);
        if (scopes) {
            let scope = _m.get(scopes, scopeId);
            return scope ? _m.toJs(scope) : false;
        }
    }

    getScopes(resourceId) {
        let entries = _m.keys(_m.get(this.state.scopes, resourceId));

        return entries ? _m.toJs(entries) : [];
    }

    receiveScope([resourceId, scope]) {
        let scopes = _m.get(this.state.scopes, resourceId);
        if (!scopes) {
            scopes = _m.hashMap();
        }
        scopes = _m.assoc(scopes, scope.id, _m.toClj(scope));
        this.setState({
            scopes: _m.assoc(this.state.scopes, resourceId, scopes)
        });
    }
}

export default ResourceStore;