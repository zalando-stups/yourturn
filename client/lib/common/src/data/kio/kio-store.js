import * as Getter from './kio-getter';
import Types from './kio-types';
import {combineReducers} from 'redux';
import applications from './application-store';
import versions from './version-store';
import approvals from './approval-store';

var KioStore = combineReducers({
    applications,
    versions,
    approvals
});

export {
    KioStore
};

class KioStoreWrapper extends Store {
    constructor(flux) {
        super();

        const kioActions = flux.getActions('kio');

        this._empty();

        this.registerAsync(
            kioActions.fetchApplications,
            this.beginFetchApplications,
            this.receiveApplications,
            this.failFetchApplications);

        this.registerAsync(
            kioActions.fetchApplication,
            this.beginFetchApplication,
            this.receiveApplication,
            this.failFetchApplication);

        this.registerAsync(
            kioActions.fetchApplicationVersions,
            null,
            this.receiveApplicationVersions,
            null);

        this.registerAsync(
            kioActions.fetchLatestApplicationVersions,
            null,
            this.receiveApplicationVersions,
            null);

        this.registerAsync(
            kioActions.fetchApplicationVersion,
            this.beginFetchApplicationVersion,
            this.receiveApplicationVersion,
            this.failFetchApplicationVersion);

        this.registerAsync(
            kioActions.fetchApprovals,
            null,
            this.receiveApprovals,
            null);

        this.register(
            kioActions.fetchApprovalTypes,
            this.receiveApprovalTypes);

        this.register(
            kioActions.loadPreferredAccount,
            this.receivePreferredAccount);

        this.register(
            kioActions.savePreferredAccount,
            this.receivePreferredAccount);
    }

    beginFetchApplications() {
        this.setState({
            redux: KioStore(this.state.redux, {
                type: Types.BEGIN_FETCH_APPLICATIONS
            })
        });
    }
    failFetchApplications() {
        this.setState({
            redux: KioStore(this.state.redux, {
                type: Types.FAIL_FETCH_APPLICATIONS
            })
        });
    }

    /**
     * Replaces application with `id` with a Pending state.
     *
     * @param  {String} id
     */
    beginFetchApplication(id) {
        this.setState({
            redux: KioStore(this.state.redux, {
                type: Types.BEGIN_FETCH_APPLICATION,
                payload: id
            })
        });
    }

    /**
     * Replaces application with `id` and version `ver` with a Pending state.
     *
     * @param  {String} id
     * @param  {String} ver
     */
    beginFetchApplicationVersion(id, ver) {
        this.setState({
            redux: KioStore(this.state.redux, {
                type: Types.BEGIN_FETCH_APPLICATION_VERSION,
                payload: [id, ver]
            })
        });
    }


    /**
     * Replaces application with Failed state.
     *
     * @param  {error} err The error passed from the flux action.
     */
    failFetchApplication(err) {
        this.setState({
            redux: KioStore(this.state.redux, {
                type: Types.FAIL_FETCH_APPLICATION,
                payload: err
            })
        });
    }

    /**
     * Replaces application version with Failed state.
     *
     * @param  {error} err The error passed from the flux action.
     */
    failFetchApplicationVersion(err) {
        this.setState({
            redux: KioStore(this.state.redux, {
                type: Types.FAIL_FETCH_APPLICATION_VERSION,
                payload: err
            })
        });
    }

    /**
     * Adds single application to store. Just calls `receiveApplications` underneath.
     *
     * @param  {object} app
     */
    receiveApplication(app) {
        this.setState({
            redux: KioStore(this.state.redux, {
                type: Types.RECEIVE_APPLICATION,
                payload: app
            })
        });
    }

    /**
     * Adds applications to store. Overwrites applications with the same id.
     *
     * @param  {Array} apps
     */
    receiveApplications(apps) {
        this.setState({
            redux: KioStore(this.state.redux, {
                type: Types.RECEIVE_APPLICATIONS,
                payload: apps
            })
        });
    }

    /**
     * Adds application versions to store.
     *
     * @param  {Array} appVersions
     */
    receiveApplicationVersions(appVersions) {
        this.setState({
            redux: KioStore(this.state.redux, {
                type: Types.RECEIVE_APPLICATION_VERSIONS,
                payload: appVersions
            })
        });
    }

    /**
     * Adds single application version to store. Just calls `receiveApplicationVersions` underneath.
     *
     * @param  {object} ver
     */
    receiveApplicationVersion(ver) {
        this.receiveApplicationVersions([ver]);
    }

    receiveApprovals([applicationId, versionId, verApprovals]) {
        this.setState({
            redux: KioStore(this.state.redux, {
                type: Types.RECEIVE_APPROVALS,
                payload: [applicationId, versionId, verApprovals]
            })
        });
    }

    receiveApprovalTypes([applicationId, approvalTypes]) {
        this.setState({
            redux: KioStore(this.state.redux, {
                type: Types.RECEIVE_APPROVAL_TYPES,
                payload: [applicationId, approvalTypes]
            })
        });
    }

    receivePreferredAccount(acc) {
        this.setState({
            redux: KioStore(this.state.redux, {
                type: Types.RECEIVE_PREFERRED_ACCOUNT,
                payload: acc
            })
        });
    }

    getApplications(term, team) {
        return Getter.getApplications(this.state.redux, term, team);
    }

    getApplicationsFetchStatus() {
        return Getter.getApplicationsFetchStatus(this.state.redux);
    }

    getApplication(id) {
        return Getter.getApplication(this.state.redux, id);
    }

    getApplicationVersions(id, filter) {
        return Getter.getApplicationVersions(this.state.redux, id, filter);
    }

    getApplicationVersion(id, ver) {
        return Getter.getApplicationVersion(this.state.redux, id, ver);
    }

    getLatestApplicationVersion(id) {
        return Getter.getLatestApplicationVersion(this.state.redux, id);
    }

    getApprovalTypes(applicationId) {
        return Getter.getApprovalTypes(this.state.redux, applicationId);
    }

    getApprovals(applicationId, versionId) {
        return Getter.getApprovals(this.state.redux, applicationId, versionId);
    }

    getLatestApplicationVersions(team) {
        return Getter.getLatestApplicationVersions(this.state.redux, team);
    }

    getPreferredAccount() {
        return Getter.getPreferredAccount(this.state.redux);
    }

    /**
     * Only for testing!
     */
    _empty() {
        this.setState({
            redux: KioStore()
        });
    }
}

export default KioStoreWrapper;
