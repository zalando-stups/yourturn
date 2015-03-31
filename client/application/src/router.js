import {Router} from 'backbone';
import puppeteer from 'common/src/puppeteer';
import List from './list/app-list';
import Detail from './detail/app-detail';
import Flux from './flux';

let store = Flux.getStore('application');

class AppRouter extends Router {
    constructor() {
        this.routes = {
            'application':      'listApplications',
            'application/:id':  'listApplication'
        }

        super();
    }

    listApplication(id) {
        console.log( 'list application', id );
        let promise;
        if (!store.getApplication(id)) {
            promise = Flux.getActions('application').fetchApplication(id);
        } else {
            promise = Promise.resolve();
        }
        promise.then( () => puppeteer.show( new Detail(), 'main' ) );
    }

    listApplications() {
        // ensure that the data we need is there
        let promise;
        if (!store.getApplications().length) {
            promise = Flux.getActions('application').fetchApplications();
        } else {
            promise = Promise.resolve();
        }

        // then show the view
        promise.then( () => puppeteer.show( new List(), 'main' ) );
    }
}

export default AppRouter;