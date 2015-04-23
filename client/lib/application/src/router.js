/** global Promise */
import {Router} from 'backbone';
import puppeteer from 'common/src/puppeteer';
import List from './application-list/application-list';
import Detail from './application-detail/application-detail';
import AppForm from './application-form/application-form';
import OAuthForm from './oauth-form/oauth-form';
import VersionForm from './version-form/version-form';
import VersionList from './version-list/version-list';
import VersionDetail from './version-detail/version-detail';
import Flux from './flux';
import 'promise.prototype.finally';

const MAIN_VIEW_ID = '#yourturn-view';

class AppRouter extends Router {
    constructor() {
        this.routes = {
            'application': 'listApplications',
            'application/create': 'createApplication',
            'application/oauth/:id': 'configureOAuth',
            'application/edit/:id': 'editApplication',
            'application/detail/:id': 'listApplication',
            'application/detail/:id/version': 'listApplicationVersions',
            'application/detail/:id/version/create': 'createApplicationVersion',
            'application/detail/:id/version/detail/:ver': 'listApplicationVersion'
        };

        super();
    }

    createApplication() {
        Flux
        .getActions('application')
        .fetchApplications()
        .finally(() => {
            puppeteer.show(new AppForm(), MAIN_VIEW_ID);
        });
    }

    createApplicationVersion(applicationId) {
        // we probably already have this app, so check
        let combinedPromise,
            versions = Flux.getActions('application').fetchApplicationVersions(applicationId),
            app = Flux.getStore('application').getApplication(applicationId);

        if (app) {
            combinedPromise = versions;
        } else {
            combinedPromise = Promise.all([
                Flux.getActions('application').fetchApplication(applicationId),
                versions
            ]);
        }
        
        combinedPromise
        .then(() => {
            puppeteer.show(new VersionForm({
                applicationId: applicationId
            }), MAIN_VIEW_ID);
        });
        //TODO catch, show error that no such app exists
    }

    editApplication(id) {
        Flux
        .getActions('application')
        .fetchApplication(id)
        .then(() => {
            puppeteer.show( new AppForm({
                applicationId: id,
                edit: true
            }), MAIN_VIEW_ID);
        });
        //TODO catch, show error that no such app exists
    }

    configureOAuth(id) {
        Flux
        .getActions('application')
        .fetchApplication(id)
        .then(() => {
            Flux.getActions('resource').fetchAllScopes();
            puppeteer.show(new OAuthForm({
                applicationId: id
            }), MAIN_VIEW_ID);
        });
        //TODO catch, show error that no such app exists
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
     * Fetches all versions for an application with `id`. Does not wait to finish and
     * instructs the Puppeteer to show the VersionView.
     *
     * @param  {String} id
     */
    listApplicationVersions(id) {
        Flux.getActions('application').fetchApplicationVersions(id);

        puppeteer.show( new VersionList({
            applicationId: id
        }), MAIN_VIEW_ID );
    }

    /**
     * Fetches details for version `ver` from an application with `id`. Does not wait to finish and
     * instructs the Puppeteer to show the VersionDetailView.
     *
     * @param  {String} id
     * @param  {String} ver
     */
    listApplicationVersion(id, ver) {
        Flux.getActions('application').fetchApplicationVersion(id, ver);

        puppeteer.show( new VersionDetail({
            applicationId: id,
            versionId: ver
        }), MAIN_VIEW_ID );
    }
}

export default AppRouter;
