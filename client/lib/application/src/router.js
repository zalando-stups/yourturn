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
import ApprovalForm from './approval-form/approval-form';
import Flux from './flux';
import 'promise.prototype.finally';

const MAIN_VIEW_ID = '#yourturn-view',
      OAUTH_ACTIONS = Flux.getActions('oauth'),
      APP_ACTIONS = Flux.getActions('application'),
      APP_STORE = Flux.getStore('application');

class AppRouter extends Router {
    constructor() {
        super({
            routes: {
                'application': 'listApplications',
                'application/create': 'createApplication',
                'application/oauth/:id': 'configureOAuth',
                'application/edit/:id': 'editApplication',
                'application/detail/:id': 'listApplication',
                'application/detail/:id/version': 'listApplicationVersions',
                'application/detail/:id/version/create': 'createApplicationVersion',
                'application/detail/:id/version/detail/:ver': 'listApplicationVersion',
                'application/detail/:id/version/edit/:ver': 'editApplicationVersion',
                'application/detail/:id/version/approve/:ver': 'approveApplicationVersion'
            }
        });
    }

    approveApplicationVersion(applicationId, versionId) {
        let promises = [];
        if (!APP_STORE.getApplication(applicationId)) {
            promises.push(APP_ACTIONS.fetchApplication(applicationId));
        }
        if (!APP_STORE.getApplicationVersion(applicationId, versionId)) {
            promises.push(APP_ACTIONS.fetchApplicationVersion(applicationId, versionId));
        }

        APP_ACTIONS.fetchApprovals(applicationId, versionId);

        Promise
        .all(promises)
        .then(() => {
            puppeteer.show(new ApprovalForm({
                applicationId: applicationId,
                versionId: versionId
            }), MAIN_VIEW_ID);
        });
    }

    createApplication() {
        APP_ACTIONS
        .fetchApplications()
        .finally(() => {
            puppeteer.show(new AppForm(), MAIN_VIEW_ID);
        });
    }

    createApplicationVersion(applicationId) {
        // we probably already have this app, so check
        let promises = [],
            versions = APP_ACTIONS.fetchApplicationVersions(applicationId),
            app = APP_STORE.getApplication(applicationId);

        if (app) {
            promises = [app];
        } else {
            promises = [
                APP_ACTIONS.fetchApplication(applicationId),
                versions
            ];
        }

        Promise
        .all(promises)
        .then(() => {
            puppeteer.show(new VersionForm({
                applicationId: applicationId
            }), MAIN_VIEW_ID);
        });
        //TODO catch, show error that no such app exists
    }

    editApplicationVersion(applicationId, versionId) {
        // we probably already have this app, so check
        let promises = [],
            version = APP_STORE.getApplicationVersion(applicationId, versionId),
            app = APP_STORE.getApplication(applicationId);

        if (!app) {
            promises.push(APP_ACTIONS.fetchApplication(applicationId));
        }
        if (!version) {
            promises.push(APP_ACTIONS.fetchApplicationVersion(applicationId, versionId));
        }
        Promise
        .all(promises)
        .then(() => {
            puppeteer.show(new VersionForm({
                applicationId: applicationId,
                versionId: versionId,
                edit: true
            }), MAIN_VIEW_ID);
        });
        //TODO catch, show error that no such app exists
    }

    editApplication(id) {
        APP_ACTIONS
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
        Promise.all([
            OAUTH_ACTIONS.fetchOAuthConfig(id),
            APP_ACTIONS.fetchApplication(id)
        ])
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
        APP_ACTIONS.fetchApplication(id);
        APP_ACTIONS.fetchApplicationVersions(id);
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
        APP_ACTIONS
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
        if (!APP_STORE.getApplication(id)) {
            APP_ACTIONS.fetchApplication(id);
        }
        APP_ACTIONS.fetchApplicationVersions(id);

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
        if (!APP_STORE.getApplication(id)) {
            APP_ACTIONS.fetchApplication(id);
        }

        APP_ACTIONS.fetchApplicationVersion(id, ver);

        puppeteer.show( new VersionDetail({
            applicationId: id,
            versionId: ver
        }), MAIN_VIEW_ID );
    }
}

export default AppRouter;
