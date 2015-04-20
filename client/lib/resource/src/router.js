import {Router} from 'backbone';
import puppeteer from 'common/src/puppeteer';
import List from './list/resource-list';
import CreateResource from './create/create-resource';
import Scope from './scope/scope-list';
import Flux from './flux';
import 'promise.prototype.finally';

class ResourceRouter extends Router {
    constructor() {
        this.routes = {
            'resource': 'listResources',
            'resource/create': 'createResource',
            'resource/:id': 'listResource'
        };

        super();
    }

    listResources() {
        puppeteer.show(new List(), '#yourturn-view');
    }

    createResource() {
        puppeteer.show(new CreateResource(), '#yourturn-view');
    }

    listResource(id) {
        puppeteer.show(new Scope({
            resourceId: id
        }), '#yourturn-view');
    }
}

export default ResourceRouter;