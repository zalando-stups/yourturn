import {Store} from 'flummox';
import Immutable from 'immutable';
import {Pending, Failed} from 'common/src/fetch-result';
import fuzzy from 'fuzzysearch';

class EssentialsStore extends Store {
    constructor(flux) {
        super();

        const essentialsActions = flux.getActions('essentials');

        this.state = {
            resources: Immutable.Map(),
            scopes: Immutable.Map(),
            applications: Immutable.Map()
        };

        this.registerAsync(
            essentialsActions.fetchResource,
            this.beginFetchResource,
            this.receiveResource,
            this.failFetchResource);

        this.registerAsync(
            essentialsActions.fetchResources,
            this.beginFetchResources,
            this.receiveResources,
            this.failFetchResources);

        this.registerAsync(
            essentialsActions.fetchScope,
            this.beginFetchScope,
            this.receiveScope,
            this.failFetchScope);

        this.registerAsync(
            essentialsActions.fetchScopes,
            this.beginFetchScopes,
            this.receiveScopes,
            this.failFetchScopes);

        this.registerAsync(
            essentialsActions.fetchScopeApplications,
            this.beginFetchApplications,
            this.receiveScopeApplications,
            this.failFetchScopeApplications);
    }

    // intentionally left as noop for now
    beginFetchResources() { }
    failFetchResources() { }
    beginFetchScopes() { }
    failFetchScopes() { }
    beginFetchScopeApplications() { }
    failFetchScopeApplications() { }

    /**
     * Sets a Pending result for this resource.
     *
     * @param  {String} resourceId ID of the resource
     */
    beginFetchResource(resourceId) {
        this.setState({
            resources: this.state.resources.set(resourceId, new Pending())
        });
    }

    /**
     * Sets a Failed result for this resource.
     *
     * @param  {Error} err Error containing the id of the resource
     */
    failFetchResource(err) {
        this.setState({
            resources: this.state.resources.set(err.id, new Failed(err))
        });
    }

    /**
     * Sets a Pending result for this scope.
     *
     * @param  {Object} resourceId ID of the resource
     * @param  {Object} scopeId    ID of the scope
     */
    beginFetchScope(resourceId, scopeId) {
        this.setState({
            scopes: this.state.scopes.setIn([resourceId, scopeId], new Pending())
        });
    }

    /**
     * Sets a Failed result for this scope.
     *
     * @param  {Error} err Error containing the id of the scope.
     */
    failFetchScope(err) {
        this.setState({
            scopes: this.state.scopes.set(err.id, new Failed(err))
        });
    }

    /**
     * Receives scopes for a resource and saves them into the store.
     */
    receiveScopes([resourceId, scopes]) {
        let state = scopes
                    .reduce((map, scp) => {
                        scp.resource_type_id = resourceId;
                        return map.setIn([resourceId, scp.id], Immutable.fromJS(scp));
                    }, this.state.scopes);
        this.setState({
            scopes: state
        });
    }

    /**
     * Receives resources and saves them into the store.
     *
     * @param  {Array} resources The resources to save.
     */
    receiveResources(resources) {
        let state = resources.reduce((map, res) => map.set(res.id, Immutable.fromJS(res)), this.state.resources);
        this.setState({
            resources: state
        });
    }

    /**
     * Receives a single scope and saves it in the store.
     *
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
            resources: this.state.resources.set(resource.id, Immutable.fromJS(resource))
        });
    }

    /**
     * Receives a list of applications that have a Scope
     *
     */
    receiveScopeApplications([resourceId, scopeId, applications]) {
        this.setState({
            applications: this.state.applications.set(`${resourceId}.${scopeId}`, Immutable.fromJS(applications))
        });
    }

    /**
     * Returns the resource with this ID, false otherwise.
     *
     * @param  {string} resourceId ID of the desired resource
     * @return {obj|false} false if it doesn’t exist.
     */
    getResource(resourceId) {
        let resource = this.state.resources.get(resourceId);
        return resource ? resource.toJS() : false;
    }

    /**
     * Returns the IDs of all available resources.
     *
     * @return {array} An empty array if there are none.
     */
    getResources(term) {
        let lcTerm = term ? term.toLowerCase() : '';

        return this.state.resources
                .valueSeq()
                .filter(r => !r.getResult)
                .filter(r => term ? fuzzy(lcTerm, r.get('name').toLowerCase()) : true)
                .sortBy(r => r.get('name').toLowerCase())
                .toJS();
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
        let scopes = this.state.scopes.get(resourceId);
        if (scopes) {
            let scope = scopes.get(scopeId);
            return scope ? scope.toJS() : false;
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
        return this.state.scopes
                    .get(resourceId, Immutable.Map())
                    .valueSeq()
                    .filter(s => !s.getResult)
                    .sortBy(s => s.get('id').toLowerCase())
                    .toJS();
    }

    /**
     * Returns all scopes of all resource types.
     *
     * @return {Array} Scopes
     */
    getAllScopes() {
        return this.state.scopes
                .valueSeq()
                .map(s => s.valueSeq())
                .flatten(true) // only one level
                .filter(s => !s.getResult)
                .sortBy(s => s.get('id').toLowerCase())
                .toJS();
    }

    /**
     * Returns all the applications for a given scope.
     *
     * @param  {string} resourceId ID of the resource
     * @param  {string} scopeId ID of the scope
     * @return {array} Empty array if there are no applications with this scope.
     */
    getScopeApplications(resourceId, scopeId) {
        let apps = this.state.applications.get(`${resourceId}.${scopeId}`, Immutable.List());
        return apps
                .sortBy(a => a.get('id').toLowerCase())
                .toJS();
    }

    /**
     * Only for testing!
     */
    _empty() {
        this.state = {
            resources: Immutable.Map(),
            scopes: Immutable.Map(),
            applications: Immutable.Map()
        };
    }
}

export default EssentialsStore;
