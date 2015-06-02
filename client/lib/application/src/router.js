/** global Promise */
import {Router} from 'backbone';
import puppeteer from 'common/src/puppeteer';
import List from './application-list/application-list';
import Detail from './application-detail/application-detail';
import AppForm from './application-form/application-form';
import OAuthForm from './oauth-form/oauth-form';
import AccessForm from './access-form/access-form';
import VersionForm from './version-form/version-form';
import VersionList from './version-list/version-list';
import VersionDetail from './version-detail/version-detail';
import ApprovalForm from './approval-form/approval-form';
import Error from 'common/src/error.hbs';
import Flux from './flux';
import 'promise.prototype.finally';

const MAIN_VIEW_ID = '#yourturn-view',
      APP_FLUX = new Flux(),
      MINT_ACTIONS = APP_FLUX.getActions('mint'),
      KIO_ACTIONS = APP_FLUX.getActions('kio'),
      KIO_STORE = APP_FLUX.getStore('kio');

class AppRouter extends Router {
    constructor(props) {
        super({
            routes: {
                'application': 'listApplications',
                'application/create': 'createApplication',
                'application/oauth/:id': 'configureOAuth',
                'application/access-control/:id': 'configureAccess',
                'application/edit/:id': 'editApplication',
                'application/detail/:id': 'listApplication',
                'application/detail/:id/version': 'listApplicationVersions',
                'application/detail/:id/version/create': 'createApplicationVersion',
                'application/detail/:id/version/detail/:ver': 'listApplicationVersion',
                'application/detail/:id/version/edit/:ver': 'editApplicationVersion',
                'application/detail/:id/version/approve/:ver': 'approveApplicationVersion'
            }
        });
        this.globalFlux = props.globalFlux;
    }

    approveApplicationVersion(applicationId, versionId) {
        let promises = [];
        if (!KIO_STORE.getApplication(applicationId)) {
            promises.push(KIO_ACTIONS.fetchApplication(applicationId));
        }
        if (!KIO_STORE.getApplicationVersion(applicationId, versionId)) {
            promises.push(KIO_ACTIONS.fetchApplicationVersion(applicationId, versionId));
        }
        promises.push(KIO_ACTIONS.fetchApprovalTypes(applicationId));
        KIO_ACTIONS.fetchApprovals(applicationId, versionId);

        Promise
        .all(promises)
        .then(() => {
            puppeteer.show(new ApprovalForm({
                applicationId: applicationId,
                versionId: versionId,
                flux: APP_FLUX,
                globalFlux: this.globalFlux
            }), MAIN_VIEW_ID);
        })
        .catch(e => puppeteer.show(Error(e), MAIN_VIEW_ID));
    }

    createApplication() {
        KIO_ACTIONS
        .fetchApplications()
        .then(() => {
            puppeteer.show(new AppForm({
                flux: APP_FLUX,
                globalFlux: this.globalFlux
            }), MAIN_VIEW_ID);
        });
    }

    createApplicationVersion(applicationId) {
        // we probably already have this app, so check
        let promises = [],
            versions = KIO_ACTIONS.fetchApplicationVersions(applicationId),
            app = KIO_STORE.getApplication(applicationId);

        if (app) {
            promises = [app];
        } else {
            promises = [
                KIO_ACTIONS.fetchApplication(applicationId),
                versions
            ];
        }
        Promise
        .all(promises)
        .then(() => {
            puppeteer.show(new VersionForm({
                applicationId: applicationId,
                flux: APP_FLUX,
                notificationActions: this.globalFlux.getActions('notification')
            }), MAIN_VIEW_ID);
        })
        .catch(e => puppeteer.show(Error(e), MAIN_VIEW_ID));
    }

    editApplicationVersion(applicationId, versionId) {
        // we probably already have this app, so check
        var promises = [],
            that = this,
            ver = KIO_STORE.getApplicationVersion(applicationId, versionId),
            app = KIO_STORE.getApplication(applicationId);
        if (!app) {
            promises.push(KIO_ACTIONS.fetchApplication(applicationId));
        }

        if (!ver) {
            promises.push(KIO_ACTIONS.fetchApplicationVersion(applicationId, versionId));
        }
        KIO_ACTIONS.fetchApprovals(applicationId, versionId);

        Promise
        .all(promises)
        .then(function ([application]) {
            if (!app) {
                app = application;
            }

            let isOwnApplication = that.globalFlux
                                        .getStore('user')
                                        .getUserTeams()
                                        .map(team => team.id)
                                        .some(id => id === app.team_id);
            if (!isOwnApplication) {
                let error = new Error();
                error.name = 'Forbidden';
                error.message = 'You can only edit your own applications!';
                error.status = 'u1F62D';
                throw error;
            }

            puppeteer.show(new VersionForm({
                applicationId: applicationId,
                versionId: versionId,
                edit: true,
                flux: APP_FLUX,
                notificationActions: this.globalFlux.getActions('notification')
            }), MAIN_VIEW_ID);
        })
        .catch(e => puppeteer.show(Error(e), MAIN_VIEW_ID));
    }

    editApplication(id) {
        KIO_ACTIONS
        .fetchApplication(id)
        .then(app => {
            let isOwnApplication = this.globalFlux
                                        .getStore('user')
                                        .getUserTeams()
                                        .map(team => team.id)
                                        .some(team_id => team_id === app.team_id);
            if (!isOwnApplication) {
                let error = new Error();
                error.name = 'Forbidden';
                error.message = 'You can only edit your own applications!';
                error.status = 'u1F62D';
                throw error;
            }
            puppeteer.show(new AppForm({
                applicationId: id,
                edit: true,
                flux: APP_FLUX,
                globalFlux: this.globalFlux
            }), MAIN_VIEW_ID);
        })
        .catch(e => puppeteer.show(Error(e), MAIN_VIEW_ID));
    }

    /**
     * Displays OAuth client configuration view. Fetches OAuth config
     * from mint, the application from kio and ALL SCOPES
     * from essentials. This we should change soon.
     *
     * @param  {String} id ID of the application
     */
    configureOAuth(id) {
        MINT_ACTIONS.fetchOAuthConfig(id);
        Promise.all([
            KIO_STORE.getApplication(id) ? Promise.resolve() : KIO_ACTIONS.fetchApplication(id),
            APP_FLUX.getActions('essentials').fetchAllScopes()
        ])
        .then(() => {
            puppeteer.show(new OAuthForm({
                applicationId: id,
                flux: APP_FLUX,
                globalFlux: this.globalFlux
            }), MAIN_VIEW_ID);
        })
        .catch(e => puppeteer.show(Error(e), MAIN_VIEW_ID));
    }

    /**
     * Displays access control configuration view. Fetches OAuth config
     * from mint, the application from kio and ALL SCOPES
     * from essentials. This we should change soon.
     *
     * @param  {String} id ID of the application
     */
    configureAccess(id) {
        MINT_ACTIONS.fetchOAuthConfig(id);
        Promise.all([
            KIO_STORE.getApplication(id) ? Promise.resolve() : KIO_ACTIONS.fetchApplication(id),
            APP_FLUX.getActions('essentials').fetchAllScopes()
        ])
        .then(() => {
            puppeteer.show(new AccessForm({
                applicationId: id,
                flux: APP_FLUX,
                globalFlux: this.globalFlux
            }), MAIN_VIEW_ID);
        })
        .catch(e => puppeteer.show(Error(e), MAIN_VIEW_ID));
    }

    /**
     * Fetches the application with `id`. Does not wait to finish and
     * instructs the Puppeteer to show the DetailView.
     *
     * @param  {String} id
     */
    listApplication(id) {
        KIO_ACTIONS.fetchApplication(id);
        KIO_ACTIONS.fetchApplicationVersions(id);
        APP_FLUX.getActions('twintip').fetchApi(id);

        puppeteer.show(new Detail({
            applicationId: id,
            flux: APP_FLUX,
            globalFlux: this.globalFlux
        }), MAIN_VIEW_ID);
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
        KIO_ACTIONS
        .fetchApplications()
        .then(() => puppeteer.show(new List({
            flux: APP_FLUX,
            globalFlux: this.globalFlux
        }), MAIN_VIEW_ID))
        .catch(e => puppeteer.show(Error(e), MAIN_VIEW_ID));
    }

    /**
     * Fetches all versions for an application with `id`. Waits to finish and
     * instructs the Puppeteer to show the VersionView.
     *
     * @param  {String} id
     */
    listApplicationVersions(id) {
        if (!KIO_STORE.getApplication(id)) {
            KIO_ACTIONS.fetchApplication(id);
        }
        KIO_ACTIONS
        .fetchApplicationVersions(id)
        .then(() => {
            puppeteer.show(new VersionList({
                applicationId: id,
                flux: APP_FLUX
            }), MAIN_VIEW_ID);
        })
        .catch(e => puppeteer.show(Error(e), MAIN_VIEW_ID));
    }

    /**
     * Fetches details for version `ver` from an application with `id`. Does not wait to finish and
     * instructs the Puppeteer to show the VersionDetailView.
     *
     * @param  {String} id
     * @param  {String} ver
     */
    listApplicationVersion(id, ver) {
        if (!KIO_STORE.getApplication(id)) {
            KIO_ACTIONS.fetchApplication(id);
        }

        KIO_ACTIONS.fetchApprovals(id, ver);
        KIO_ACTIONS
        .fetchApplicationVersion(id, ver)
        .then(() => {
            puppeteer.show(new VersionDetail({
                applicationId: id,
                versionId: ver,
                flux: APP_FLUX,
                globalFlux: this.globalFlux
            }), MAIN_VIEW_ID);
        });
    }
}

export default AppRouter;
