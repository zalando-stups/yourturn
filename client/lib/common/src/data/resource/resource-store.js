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
            resourceActions.fetchResource,
            this.receiveResource);
        this.register(
            resourceActions.fetchResources,
            this.receiveResources);
        this.register(
            resourceActions.fetchScope,
            this.receiveScope);
        this.register(
            resourceActions.fetchScopes,
            this.receiveScopes);
        this.register(
            resourceActions.fetchAllScopes,
            this.receiveAllScopes);
    }

    receiveAllScopes(scopes) {
        let state = scopes.reduce((map, scp) => {
            let resource = _m.get(map, scp.resourceId) || _m.hashMap();
            resource = _m.assoc(resource, scp.id, _m.toClj(scp));
            return _m.assoc(map, scp.resourceId, resource);
        }, this.state.scopes);
        this.setState({
            scopes: state
        });
    }

    receiveScopes([resourceId, scopes]) {
        let state = scopes.reduce((map, scp) => {
            let resource = _m.get(map, resourceId) || _m.hashMap();
            resource = _m.assoc(resource, scp.id, _m.toClj(scp));
            return _m.assoc(map, resourceId, resource);
        }, this.state.scopes);
        this.setState({
            scopes: state
        });
    }

    receiveResources(resources) {
        let state = resources.reduce((map, res) => _m.assoc(map, res.id, _m.toClj(res)), this.state.resources);
        this.setState({
            resources: state
        });
    }

    /**
     * Receives a single scope and saves it in the store.
     *
     * @param  {string} resourceId ID of the owning resource
     * @param  {obj} scope The scope itself
     */
    receiveScope([resourceId, scope]) {
        this.receiveScopes([resourceId, [scope]]);
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
        entries = _m.sortBy(e => _m.get(e, 'id'), entries);
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
     * Returns all the scopes for this resource.
     *
     * @param  {string} resourceId ID of the resource
     * @return {array} Empty array if there are not scopes.
     */
    getScopes(resourceId) {
        let entries = _m.vals(_m.get(this.state.scopes, resourceId));
        entries = _m.sortBy(e => _m.get(e, 'id').toLowerCase(), entries);
        return entries ? _m.toJs(entries) : [];
    }

    getAllScopes() {
        let entries = _m.map(res => _m.vals(_m.get(res, 1)), this.state.scopes);
        entries = _m.flatten(entries);
        entries = _m.sortBy(e => _m.get(e, 'id').toLowerCase(), entries);
        return entries ? _m.toJs(entries) : [];
    }
}

export default ResourceStore;
