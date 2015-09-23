import {Store} from 'flummox';
import Types from './essentials-types';
import * as Getter from './essentials-getter';

import {combineReducers} from 'redux';
import resources from './resource-store';
import scopes from './scope-store';
import scopeApps from './application-store';

var EssentialsStore = combineReducers({
    resources,
    scopes,
    scopeApps
});

export {
    EssentialsStore
};

class EssentialsStoreWrapper extends Store {
    constructor(flux) {
        super();

        const essentialsActions = flux.getActions('essentials');

        this._empty();

        this.registerAsync(
            essentialsActions.fetchResource,
            this.beginFetchResource,
            this.receiveResource,
            this.failFetchResource);

        this.registerAsync(
            essentialsActions.fetchResources,
            null,
            this.receiveResources,
            null);

        this.registerAsync(
            essentialsActions.fetchScope,
            this.beginFetchScope,
            this.receiveScope,
            this.failFetchScope);

        this.registerAsync(
            essentialsActions.fetchScopes,
            null,
            this.receiveScopes,
            null);

        this.registerAsync(
            essentialsActions.fetchScopeApplications,
            null,
            this.receiveScopeApplications,
            null);
    }

    /**
     * Sets a Pending result for this resource.
     *
     * @param  {String} resourceId ID of the resource
     */
    beginFetchResource(resourceId) {
        this.setState({
            redux: EssentialsStore(this.state.redux, {
                type: Types.BEGIN_FETCH_RESOURCE,
                payload: resourceId
            })
        });
    }

    /**
     * Sets a Failed result for this resource.
     *
     * @param  {Error} err Error containing the id of the resource
     */
    failFetchResource(err) {
        this.setState({
            redux: EssentialsStore(this.state.redux, {
                type: Types.FAIL_FETCH_RESOURCE,
                payload: err
            })
        });
    }

    /**
     * Receives a single resource and saves it. Other resources
     * with the same ID are overwritten.
     *
     * @param  {object} resource The resource
     */
    receiveResource(resource) {
        this.setState({
            redux: EssentialsStore(this.state.redux, {
                type: Types.RECEIVE_RESOURCE,
                payload: resource
            })
        });
    }

    /**
     * Receives resources and saves them into the store.
     *
     * @param {Array} res The resources to save.
     */
    receiveResources(res) {
        this.setState({
            redux: EssentialsStore(this.state.redux, {
                type: Types.RECEIVE_RESOURCES,
                payload: res
            })
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
            redux: EssentialsStore(this.state.redux, {
                type: Types.BEGIN_FETCH_SCOPE,
                payload: [resourceId, scopeId]
            })
        });
    }

    /**
     * Sets a Failed result for this scope.
     *
     * @param  {Error} err Error containing the id of the scope.
     */
    failFetchScope(err) {
        this.setState({
            redux: EssentialsStore(this.state.redux, {
                type: Types.FAIL_FETCH_SCOPE,
                payload: err
            })
        });
    }

    /**
     * Receives scopes for a resource and saves them into the store.
     */
    receiveScopes([resourceId, scps]) {
        this.setState({
            redux: EssentialsStore(this.state.redux, {
                type: Types.RECEIVE_SCOPES,
                payload: [resourceId, scps]
            })
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
     * Receives a list of applications that have a Scope
     *
     */
    receiveScopeApplications([resourceId, scopeId, applications]) {
        this.setState({
            redux: EssentialsStore(this.state.redux, {
                type: Types.RECEIVE_SCOPE_APPLICATIONS,
                payload: [resourceId, scopeId, applications]
            })
        });
    }

    getResource(resourceId) {
        return Getter.getResource(this.state.redux.resources, resourceId);
    }

    getResources(term) {
        return Getter.getResources(this.state.redux.resources, term);
    }

    getScope(resourceId, scopeId) {
        return Getter.getScope(this.state.redux.scopes, resourceId, scopeId);
    }

    getScopes(resourceId) {
        return Getter.getScopes(this.state.redux.scopes, resourceId);
    }

    getAllScopes() {
        return Getter.getAllScopes(this.state.redux.scopes);
    }

    getScopeApplications(resourceId, scopeId) {
        return Getter.getScopeApplications(this.state.redux.scopeApps, resourceId, scopeId);
    }

    /**
     * Only for testing!
     */
    _empty() {
        this.state = {
            redux: EssentialsStore()
        };
    }
}

export default EssentialsStoreWrapper;
