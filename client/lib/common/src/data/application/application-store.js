import {Store} from 'flummox';
import _ from 'lodash';
import _m from 'mori';
import {Pending, Failed} from 'common/src/fetch-result';
import FetchResult from 'common/src/fetch-result';

class ApplicationStore extends Store {
    constructor(flux) {
        super();

        const appActions = flux.getActions('application');

        this.state = {
            applications: _m.hashMap(),
            versions: _m.hashMap(),
            approvals: _m.hashMap(),
            approvalTypes: _m.hashMap()
        };

        this.registerAsync(
            appActions.fetchApplications,
            this.beginFetchApplications,
            this.receiveApplications,
            this.failFetchApplications);

        this.registerAsync(
            appActions.fetchApplication,
            this.beginFetchApplication,
            this.receiveApplication,
            this.failFetchApplication);

        this.registerAsync(
            appActions.fetchApplicationVersions,
            this.beginFetchApplicationVersions,
            this.receiveApplicationVersions,
            this.failFetchApplications);

        this.registerAsync(
            appActions.fetchApplicationVersion,
            this.beginFetchApplicationVersion,
            this.receiveApplicationVersion,
            this.failFetchApplicationVersion);

        this.registerAsync(
            appActions.fetchApprovals,
            this.beginFetchApprovals,
            this.receiveApprovals,
            this.failFetchApprovals);

        this.register(
            appActions.fetchApprovalTypes,
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
            applications: _m.assoc(this.state.applications, id, new Pending())
        });
    }

    /**
     * Replaces application with `id` and version `ver` with a Pending state.
     *
     * @param  {String} id
     * @param  {String} ver
     */
    beginFetchApplicationVersion(id, ver) {
        let updatedApp = _m.assoc(_m.get(this.state.versions, id) || _m.hashMap(), ver, new Pending());
        this.setState({
            versions: _m.assoc(this.state.versions, id, updatedApp)
        });
    }


    /**
     * Replaces application with Failed state.
     *
     * @param  {error} err The error passed from the flux action.
     */
    failFetchApplication(err) {
        this.setState({
            applications: _m.assoc(this.state.applications, err.id, new Failed(err))
        });
    }

    /**
     * Replaces application version with Failed state.
     *
     * @param  {error} err The error passed from the flux action.
     */
    failFetchApplicationVersion(err) {
        let updatedVer = _m.assoc(_m.get(this.state.versions, err.id), err.ver, new Failed(err));
        this.setState({
            versions: _m.assoc(this.state.versions, err.id, updatedVer)
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
                            (map, app) => _m.assoc(map, app.id, _m.toClj(app)),
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
                                let app = _m.get(map, ver.application_id) || _m.hashMap();
                                ver.last_modified = Date.parse(ver.last_modified);
                                app = _m.assoc(app, ver.id, _m.toClj(ver));
                                return _m.assoc(map, ver.application_id, app);
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
        let availableApps = _m.filter(app => !(app instanceof FetchResult), _m.vals(this.state.applications));
        if (term) {
            availableApps = _m.filter(app => (_m.get(app, 'name')
                                                .toLowerCase()
                                                .indexOf(term.toLowerCase()) !== -1), availableApps);
        }
        return _.sortBy(_m.toJs(availableApps) || [], a => a.name ? a.name.toLowerCase() : null);
    }

    /**
     * Returns all applications that belong to a team and are available
     *
     * @param  {string} term Substring to match an application name
     * @param  {Array} teamIds List of team ids that should be included
     * @return {Array} Available applications
     */
    getTeamApplications(term, teamIds) {
        let availableApps = _m.toClj(this.getApplications(term));
        return _m.toJs(_m.filter(app => (teamIds.indexOf(_m.get(app, 'team_id')) !== -1), availableApps));
    }

    /**
     * Returns all applications that don't belong to a team and are available
     *
     * @param  {string} term Substring to match an application name
     * @param  {Array} teamIds List of team ids that should be filtered out
     * @return {Array} Available applications
     */
    getOtherApplications(term, teamIds) {
        let availableApps = _m.toClj(this.getApplications(term));
        return _m.toJs(_m.remove(app => (teamIds.indexOf(_m.get(app, 'team_id')) !== -1), availableApps));
    }


    /**
     * Returns the application with `id`. Does not care about its state, e.g. whether or not
     * it's Pending or Failed. Returns null if there is no application with this id.
     *
     * @param  {String} id
     * @return {object} The application with this id
     */
    getApplication(id) {
        let app = _m.get(this.state.applications, id);
        return app ? _m.toJs(app) : false;
    }

    /**
     * Returns all versions for a given application
     *
     * @return {Array} Available applications
     */
    getApplicationVersions(id, filter) {
        let versions = _m.vals(_m.get(this.state.versions, id)),
            existing = _m.filter(v => !(v instanceof FetchResult), versions);
        return _.chain(_m.toJs(existing) || [])
                .filter(v => !!filter ? v.id.indexOf(filter) >= 0 : true)
                .sortBy(v => v.last_modified)
                .reverse()
                .value();
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
        let app = _m.get(this.state.versions, id);
        if (app) {
            let version = _m.get(app, ver);
            return version ? _m.toJs(version) : false;
        }
    }

    receiveApprovals([applicationId, versionId, approvals]) {
        function getKey(apr) {
            return `${apr.user_id}.${apr.approved_at}.${apr.approval_type}`;
        }

        let newState = approvals.reduce(
                            (app, approval) => {
                                // convert to timestamp
                                approval.timestamp = Date.parse(approval.approved_at);
                                return _m.assoc(app, getKey(approval), _m.toClj(approval));
                            },
                            _m.hashMap());
        this.setState({
            approvals: _m.assocIn(this.state.approvals, [applicationId, versionId], newState)
        });
    }

    receiveApprovalTypes([applicationId, approvalTypes]) {
        this.setState({
            approvalTypes: _m.assoc(this.state.approvalTypes, applicationId, _m.toClj(approvalTypes))
        });
    }

    /**
     * Returns all used approval types in versions of an application.
     *
     * @param  {String} applicationId ID of the application
     * @return {Array}                The used approval types
     */
    getApprovalTypes(applicationId) {
        return _m.toJs(_m.get(this.state.approvalTypes, applicationId, _m.vector()));
    }

    /**
     * Returns approvals for an application version.
     *
     * @param  {String} applicationId ID of the application
     * @param  {String} versionId     ID of the version
     * @return {Array}                Approvals sorted by date asc
     */
    getApprovals(applicationId, versionId) {
        let approvals = _m.toJs(_m.vals(_m.getIn(this.state.approvals, [applicationId, versionId]))) || [];
        return approvals.sort((a, b) => a.timestamp < b.timestamp ? -1 : b.timestamp < a.timestamp ? 1 : 0);
    }


    /**
     * Only for testing!
     */
    _empty() {
        this.setState({
            applications: _m.hashMap(),
            versions: _m.hashMap(),
            approvals: _m.hashMap()
        });
    }
}

export default ApplicationStore;
