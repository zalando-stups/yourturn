import {Store} from 'flummox';
import Immutable from 'immutable';
import fuzzysearch from 'fuzzysearch';
import {Pending, Failed} from 'common/src/fetch-result';
import FetchResult from 'common/src/fetch-result';

class KioStore extends Store {
    constructor(flux) {
        super();

        const kioActions = flux.getActions('kio');

        this.state = {
            applications: Immutable.Map(),
            versions: Immutable.Map(),
            approvals: Immutable.Map(),
            approvalTypes: Immutable.Map()
        };

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
            this.beginFetchApplicationVersions,
            this.receiveApplicationVersions,
            this.failFetchApplications);

        this.registerAsync(
            kioActions.fetchApplicationVersion,
            this.beginFetchApplicationVersion,
            this.receiveApplicationVersion,
            this.failFetchApplicationVersion);

        this.registerAsync(
            kioActions.fetchApprovals,
            this.beginFetchApprovals,
            this.receiveApprovals,
            this.failFetchApprovals);

        this.register(
            kioActions.fetchApprovalTypes,
            this.receiveApprovalTypes);
    }

    // intentionally left as noop for now
    beginFetchApplications() { }
    failFetchApplications() { }

    beginFetchApplicationVersions() { }
    failFetchApplicationVersions() { }

    beginFetchApprovals() { }
    failFetchApprovals() { }

    /**
     * Replaces application with `id` with a Pending state.
     *
     * @param  {String} id
     */
    beginFetchApplication(id) {
        this.setState({
            applications: this.state.applications.set(id, new Pending())
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
            versions: this.state.versions.setIn([id, ver], new Pending())
        });
    }


    /**
     * Replaces application with Failed state.
     *
     * @param  {error} err The error passed from the flux action.
     */
    failFetchApplication(err) {
        this.setState({
            applications: this.state.applications.set(err.id, new Failed(err))
        });
    }

    /**
     * Replaces application version with Failed state.
     *
     * @param  {error} err The error passed from the flux action.
     */
    failFetchApplicationVersion(err) {
        this.setState({
            versions: this.state.versions.setIn([err.id, err.ver], new Failed(err))
        });
    }

    /**
     * Adds single application to store. Just calls `receiveApplications` underneath.
     *
     * @param  {object} app
     */
    receiveApplication(app) {
        this.receiveApplications([app]);
    }

    /**
     * Adds applications to store. Overwrites applications with the same id.
     *
     * @param  {Array} apps
     */
    receiveApplications(apps) {
        let newState = apps.reduce(
                            (map, app) => map.set(app.id, Immutable.Map(app)),
                            this.state.applications);
        this.setState({
            applications: newState
        });
    }

    /**
     * Adds application versions to store.
     *
     * @param  {Array} versions
     */
    receiveApplicationVersions(versions) {
        let newState = versions.reduce(
                            (map, ver) => {
                                ver.last_modified = Date.parse(ver.last_modified);
                                return map.setIn([ver.application_id, ver.id], Immutable.Map(ver));
                            },
                            this.state.versions);
        this.setState({
            versions: newState
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


    /**
     * Returns all applications that are available (as in not Pending or Failed) RIGHT NAO!
     *
     * @param  {string} term Filters list of applications by names that contain term
     * @return {Array} Available applications
     */
    getApplications(term) {
        let availableApps = this.state.applications
                                .valueSeq()
                                .filter(app => !app.getResult)
                                .filter(app => term ?
                                                fuzzysearch(term.toLowerCase(), `${app.get('name').toLowerCase()} ${app.get('team_id').toLowerCase()}`) :
                                                true)
                                .sortBy(app => app.get('name').toLowerCase())
                                .toJS();
        return availableApps;
    }

    /**
     * Returns the application with `id`. Does not care about its state, e.g. whether or not
     * it's Pending or Failed. Returns null if there is no application with this id.
     *
     * @param  {String} id
     * @return {object} The application with this id
     */
    getApplication(id) {
        let app = this.state.applications.get(id);
        return app ?
                app.toJS() :
                false;
    }

    /**
     * Returns all versions for a given application
     *
     * @return {Array} Available versions
     */
    getApplicationVersions(id, filter) {
        let versions = this.state
                            .versions
                            .get(id);
        if (versions) {
            return versions
                        .valueSeq()
                        .filter(v => !v.getResult)
                        .filter(v => filter ?
                                        fuzzysearch(filter, v.get('id')) :
                                        true)
                        .sortBy(v => v.get('last_modified'))
                        .reverse()
                        .toJS();
        }
        return [];
    }


    /**
     * Returns the application version with `id`. Does not care about its state, e.g. whether or not
     * it's Pending or Failed. Returns null if there is no version with this id.
     *
     * @param  {String} id
     * @param  {String} ver
     * @return {object} The application version with this id and ver
     */
    getApplicationVersion(id, ver) {
        let version = this.state.versions.getIn([id, ver]);
        return version ? version.toJS() : false;
    }

    getLatestApplicationVersion(id) {
        let versions = this.getApplicationVersions(id);
        return versions.length ? versions[0] : false;
    }

    receiveApprovals([applicationId, versionId, approvals]) {
        function getKey(apr) {
            return `${apr.user_id}.${apr.approved_at}.${apr.approval_type}`;
        }

        let newState = approvals.reduce(
                            (app, approval) => {
                                // convert to timestamp
                                approval.timestamp = Date.parse(approval.approved_at);
                                return app.set(getKey(approval), Immutable.Map(approval));
                            },
                            Immutable.Map());
        this.setState({
            approvals: this.state.approvals.setIn([applicationId, versionId], newState)
        });
    }

    receiveApprovalTypes([applicationId, approvalTypes]) {
        this.setState({
            approvalTypes: this.state.approvalTypes.set(applicationId, Immutable.fromJS(approvalTypes))
        });
    }

    /**
     * Returns all used approval types in versions of an application.
     *
     * @param  {String} applicationId ID of the application
     * @return {Array}                The used approval types
     */
    getApprovalTypes(applicationId) {
        return this.state.approvalTypes.get(applicationId, []);
    }

    /**
     * Returns approvals for an application version.
     *
     * @param  {String} applicationId ID of the application
     * @param  {String} versionId     ID of the version
     * @return {Array}                Approvals sorted by date asc
     */
    getApprovals(applicationId, versionId) {
        let approvals = this.state.approvals.getIn([applicationId, versionId]);
        approvals = approvals ? approvals.valueSeq().toJS() : [];
        return approvals.sort((a, b) => a.timestamp < b.timestamp ?
                                            -1 :
                                            b.timestamp < a.timestamp ?
                                                1 : 0);
    }


    /**
     * Only for testing!
     */
    _empty() {
        this.setState({
            applications: Immutable.Map(),
            versions: Immutable.Map(),
            approvals: Immutable.Map(),
            approvalTypes: Immutable.Map()
        });
    }
}

export default KioStore;
