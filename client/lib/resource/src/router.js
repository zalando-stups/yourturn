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

    listResources() {
        puppeteer.show(new ResourceList(), MAIN_VIEW_ID);
    }

    createResource() {
        puppeteer.show(new CreateResource(), MAIN_VIEW_ID);
    }

    listResource(resourceId) {
        puppeteer.show(new ResouceDetail({
            resourceId: resourceId
        }), MAIN_VIEW_ID);
    }

    createScope(resourceId) {
        puppeteer.show(new CreateScope({
            resourceId: resourceId
        }), MAIN_VIEW_ID);
    }

    listScope(resourceId, scopeId) {
        puppeteer.show(new ScopeDetail({
            resourceId: resourceId,
            scopeId: scopeId
        }), MAIN_VIEW_ID);
    }
}

export default ResourceRouter;