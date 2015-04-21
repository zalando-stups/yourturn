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

    /**
     * Receives a single resource and saves it. Other resources
     * with the same ID are overwritten.
     *
     * @param  {object} resource The resource
     */
    receiveResource(resource) {
        this.setState({
            resources: _m.assoc(this.state.resources, resource.id, _m.toClj(resource))
        });
    }

    /**
     * Returns the resource with this ID, false otherwise.
     *
     * @param  {string} resourceId ID of the desired resource
     * @return {obj|false} false if it doesn’t exist.
     */
    getResource(resourceId) {
        let resource = _m.get(this.state.resources, resourceId);
        return resource ? _m.toJs(resource) : false;
    }

    /**
     * Returns the IDs of all available resources.
     *
     * @return {array} An empty array if there are none.
     */
    getResources() {
        let entries = _m.keys(this.state.resources);
        return entries ? _m.toJs(entries) : [];
    }

    /**
     * Returns the scope with this ID for this resource.
     * If there is no such resource or scope, false is
     * returned.
     *
     * @param  {string} resourceId ID of the resource
     * @param  {string} scopeId ID of the scope
     * @return {obj|false} False if not found.
     */
    getScope(resourceId, scopeId) {
        let scopes = _m.get(this.state.scopes, resourceId);
        if (scopes) {
            let scope = _m.get(scopes, scopeId);
            return scope ? _m.toJs(scope) : false;
        }
        return false;
    }

    /**
     * Returns IDs of all the scopes for this resource.
     *
     * @param  {string} resourceId ID of the resource
     * @return {array} Empty array if there are not scopes.
     */
    getScopes(resourceId) {
        let entries = _m.keys(_m.get(this.state.scopes, resourceId));

        return entries ? _m.toJs(entries) : [];
    }

    /**
     * Receives a single scope and saves it in the store.
     *
     * @param  {string} resourceId ID of the owning resource
     * @param  {obj} scope The scope itself
     */
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