import {Router} from 'backbone';
import puppeteer from 'common/src/puppeteer';
import List from './list/application-list';
import Detail from './detail/application-detail';
import Create from './create/create-application';
import VersionList from './version-list/application-version';
import Flux from './flux';
import 'promise.prototype.finally';

const MAIN_VIEW_ID = '#yourturn-view';

class AppRouter extends Router {
    constructor() {
        this.routes = {
            'application/create': 'createApplication',
            'application': 'listApplications',
            'application/:id': 'listApplication',
            'application/:id/version': 'listApplicationVersions'
        };

        super();
    }

    createApplication() {
        Flux
        .getActions('application')
        .fetchApplications()
        .finally(() => {
            puppeteer.show(new Create(), MAIN_VIEW_ID);
        });
    }

    /**
     * Fetches the application with `id`. Does not wait to finish and
     * instructs the Puppeteer to show the DetailView.
     *
     * @param  {String} id
     */
    listApplication(id) {
        Flux.getActions('application').fetchApplication(id);
        Flux.getActions('api').fetchApi(id);

        puppeteer.show( new Detail({
            applicationId: id
        }), MAIN_VIEW_ID );
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
        .finally( () => puppeteer.show( new List(), MAIN_VIEW_ID ) );
    }

    /**
     * Fetches the application version with `id`. Does not wait to finish and
     * instructs the Puppeteer to show the VersionView.
     *
     * @param  {String} id
     */
    listApplicationVersions(id) {
        Flux.getActions('application').fetchApplicationVersions(id);

        puppeteer.show( new VersionList({
            applicationId: id
        }), '#yourturn-view' );
    }
}

export default AppRouter;
