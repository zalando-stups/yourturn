import {Router} from 'backbone';
import puppeteer from 'common/src/puppeteer';
import List from './list/app-list';
import Detail from './detail/app-detail';
import Flux from './flux';
import 'promise.prototype.finally';

let store = Flux.getStore('application');

class AppRouter extends Router {
    constructor() {
        this.routes = {
            'application': 'listApplications',
            'application/:id': 'listApplication'
        };

        super();
    }

    /**
     * Checks if application with id is already in the store,
     * if not triggers a fetch action. Does not wait to finish and
     * instructs the Puppeteer to show the DetailView.
     *
     * @param  {string} id
     */
    listApplication(id) {
        if (!store.getApplication(id)) {
            Flux.getActions('application').fetchApplication(id);
        }
        puppeteer.show( new Detail({
            applicationId: id
        }), 'main' )
    }

    /**
     * Triggers a fetch action for all applications (because we
     * never know if we have all of them already), waits for it,
     * then shows ListView.
     * 
     */
    listApplications() {
        // ensure that the data we need is there
        // then show the view
        Flux
        .getActions('application')
        .fetchApplications()
        .finally( () => puppeteer.show( new List(), 'main' ) );
    }
}

export default AppRouter;