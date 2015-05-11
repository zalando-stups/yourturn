import {Router} from 'backbone';
import puppeteer from 'common/src/puppeteer';
import ResourceList from './resource-list/resource-list';
import ResourceForm from './resource-form/resource-form';
import ResouceDetail from './resource-detail/resource-detail';
import ScopeForm from './scope-form/scope-form';
import ScopeDetail from './scope-detail/scope-detail';
import Error from 'common/src/error.hbs';
import Flux from './flux';
import 'promise.prototype.finally';

const RES_FLUX = new Flux(),
      RES_ACTIONS = RES_FLUX.getActions('resource'),
      MAIN_VIEW_ID = '#yourturn-view';

class ResourceRouter extends Router {
    constructor(props) {
        super({
            routes: {
                'resource': 'listResources',
                'resource/create': 'createResource',
                'resource/detail/:id': 'listResource',
                'resource/edit/:id': 'editResource',
                'resource/detail/:id/scope/create': 'createScope',
                'resource/detail/:id/scope/detail/:scope': 'listScope',
                'resource/detail/:id/scope/edit/:scope': 'editScope'
            }
        });
        this.globalFlux = props.globalFlux;
    }

    /**
     * Lists available resources.
     */
    listResources() {
        RES_ACTIONS
        .fetchResources()
        .then(() => puppeteer.show(new ResourceList({
            flux: RES_FLUX
        }), MAIN_VIEW_ID) )
        .catch(e => puppeteer.show(Error(e), MAIN_VIEW_ID));
    }

    /**
     * Shows form to create a new resource
     */
    createResource() {
        RES_ACTIONS
        .fetchResources()
        .then(() => puppeteer.show(new ResourceForm({
            flux: RES_FLUX,
            notificationActions: this.globalFlux.getActions('notification')
        }), MAIN_VIEW_ID) )
        .catch(e => puppeteer.show(Error(e), MAIN_VIEW_ID));
    }

    /**
     * Shows form to edit a resource
     * @param  {String} resourceId ID of the resource
     */
    editResource(resourceId) {
        RES_ACTIONS
        .fetchResource(resourceId)
        .then(() => puppeteer.show(new ResourceForm({
            flux: RES_FLUX,
            notificationActions: this.globalFlux.getActions('notification'),
            resourceId: resourceId,
            edit: true
        }), MAIN_VIEW_ID) )
        .catch(e => puppeteer.show(Error(e), MAIN_VIEW_ID));
    }

    /**
     * Shows detailed view of this resource
     * @param  {string} resourceId ID of the resource in question
     */
    listResource(resourceId) {
        RES_ACTIONS.fetchResource(resourceId);
        RES_ACTIONS.fetchScopes(resourceId);
        puppeteer.show(new ResouceDetail({
            resourceId: resourceId,
            flux: RES_FLUX
        }), MAIN_VIEW_ID);
    }

    /**
     * Shows form to create a new scope for a resource.
     * @param  {string} resourceId ID of the resource to add this scope to.
     */
    createScope(resourceId) {
        Promise.all([
            RES_ACTIONS.fetchResource(resourceId),
            RES_ACTIONS.fetchScopes(resourceId)
        ])
        .then(() => puppeteer.show(new ScopeForm({
            resourceId: resourceId,
            flux: RES_FLUX,
            notificationActions: this.globalFlux.getActions('notification')
        }), MAIN_VIEW_ID) )
        .catch(e => puppeteer.show(Error(e), MAIN_VIEW_ID));
    }

    /**
     * Shows detailed view of this scope.
     * @param  {string} resourceId The ID of the scope’s resource.
     * @param  {string} scopeId The ID of the scope
     */
    listScope(resourceId, scopeId) {
        RES_ACTIONS.fetchScope(resourceId, scopeId);
        RES_ACTIONS.fetchScopeApplications(resourceId, scopeId);
        puppeteer.show(new ScopeDetail({
            resourceId: resourceId,
            scopeId: scopeId,
            flux: RES_FLUX
        }), MAIN_VIEW_ID);
    }

    /**
     * Shows form to edit a scope for a resource.
     * @param  {string} resoueceId ID of the resource this scope belongs to.
     * @param  {string} scopeId ID of the scope to edit.
     */
    editScope(resourceId, scopeId) {
        Promise.all([
            RES_ACTIONS.fetchResource(resourceId),
            RES_ACTIONS.fetchScopes(resourceId)
        ])
        .then(() => {
            puppeteer.show( new ScopeForm({
                resourceId: resourceId,
                scopeId: scopeId,
                edit: true,
                flux: RES_FLUX,
                notificationActions: this.globalFlux.getActions('notification')
            }), MAIN_VIEW_ID);
        })
        .catch(e => puppeteer.show(Error(e), MAIN_VIEW_ID));

    }
}

export default ResourceRouter;
