import {Router} from 'backbone';
import puppeteer from 'common/src/puppeteer';
import ResourceList from './resource-list/resource-list';
import CreateResource from './create-resource/create-resource';
import ResouceDetail from './resource-detail/resource-detail';
import CreateScope from './create-scope/create-scope';
import Flux from './flux';
import 'promise.prototype.finally';

class ResourceRouter extends Router {
    constructor() {
        this.routes = {
            'resource': 'listResources',
            'resource/create': 'createResource',
            'resource/:id': 'listResource',
            'resource/:id/create': 'createScope'
        };

        super();
    }

    listResources() {
        puppeteer.show(new ResourceList(), '#yourturn-view');
    }

    createResource() {
        puppeteer.show(new CreateResource(), '#yourturn-view');
    }

    listResource(id) {
        puppeteer.show(new ResouceDetail({
            resourceId: id
        }), '#yourturn-view');
    }

    createScope(id) {
        puppeteer.show(new CreateScope({
            resourceId: id
        }), '#yourturn-view');
    }
}

export default ResourceRouter;