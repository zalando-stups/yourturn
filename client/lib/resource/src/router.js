import {Router} from 'backbone';
import puppeteer from 'common/src/puppeteer';
import ResourceList from './resource-list/resource-list';
import CreateResource from './create-resource/create-resource';
import ResouceDetail from './resource-detail/resource-detail';
import CreateScope from './create-scope/create-scope';
import ScopeDetail from './scope-detail/scope-detail';
import Flux from './flux';
import 'promise.prototype.finally';

const MAIN_VIEW_ID = '#yourturn-view';

class ResourceRouter extends Router {
    constructor() {
        this.routes = {
            'resource': 'listResources',
            'resource/create': 'createResource',
            'resource/:id': 'listResource',
            'resource/:id/create': 'createScope',
            'resource/:id/:scope': 'listScope'
        };

        super();
    }

    /**
     * Lists available resources.
     */
    listResources() {
        puppeteer.show(new ResourceList(), MAIN_VIEW_ID);
    }

    /**
     * Shows form to create a new resource
     */
    createResource() {
        puppeteer.show(new CreateResource(), MAIN_VIEW_ID);
    }

    /**
     * Shows detailed view of this resource
     * @param  {string} resourceId ID of the resource in question
     */
    listResource(resourceId) {
        puppeteer.show(new ResouceDetail({
            resourceId: resourceId
        }), MAIN_VIEW_ID);
    }

    /**
     * Shows form to create a new scope for a resource.
     * @param  {string} resourceId ID of the resource to add this scope to.
     */
    createScope(resourceId) {
        puppeteer.show(new CreateScope({
            resourceId: resourceId
        }), MAIN_VIEW_ID);
    }

    /**
     * Shows detailed view of this scope.
     * @param  {string} resourceId The ID of the scope’s resource.
     * @param  {string} scopeId The ID of the scope.
     */
    listScope(resourceId, scopeId) {
        puppeteer.show(new ScopeDetail({
            resourceId: resourceId,
            scopeId: scopeId
        }), MAIN_VIEW_ID);
    }
}

export default ResourceRouter;