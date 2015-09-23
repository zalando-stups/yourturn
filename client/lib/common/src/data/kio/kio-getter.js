import fuzzysearch from 'fuzzysearch';
import {FETCH_STATE} from './application-store';

/**
 * Returns approvals for an application version.
 *
 * @param  {object} state Current state of the store
 * @param  {String} applicationId ID of the application
 * @param  {String} versionId     ID of the version
 * @return {Array}                Approvals sorted by date asc
 */
function getApprovals(state, applicationId, versionId) {
    let approvals = state.getIn(['approvals', applicationId, versionId]);
    approvals = approvals ? approvals.valueSeq().toJS() : [];
    return approvals.sort((a, b) => a.timestamp < b.timestamp ?
                                        -1 :
                                        b.timestamp < a.timestamp ?
                                            1 : 0);
}


/**
 * Returns all used approval types in versions of an application.
 *
 * @param  {object} state Current state of the store
 * @param  {String} applicationId ID of the application
 * @return {Array}                The used approval types
 */
function getApprovalTypes(state, applicationId) {
    return state.getIn(['approvalTypes', applicationId], []);
}

/**
 * Returns the application version with `id`. Does not care about its state, e.g. whether or not
 * it's Pending or Failed. Returns null if there is no version with this id.
 *
 * @param  {object} state Current state of the store
 * @param  {String} id
 * @param  {String} ver
 * @return {object} The application version with this id and ver
 */
function getApplicationVersion(state, id, ver) {
    let version = state.getIn([id, ver]);
    return version ? version.toJS() : false;
}

/**
 * Returns all applications that are available (as in not Pending or Failed) RIGHT NAO!
 *
 * @param  {object} state Current state of the store
 * @param  {string} term Filters list of applications by names that contain term
 * @return {Array} Available applications
 */
function getApplications(state, term) {
    let availableApps = state
                            .get('applications')
                            .valueSeq()
                            .filter(app => !app.getResult)
                            .filter(app => term ?
                                            fuzzysearch(term.toLowerCase(), `${app.get('id').toLowerCase()} ${app.get('name').toLowerCase()} ${app.get('team_id').toLowerCase()}`) :
                                            true)
                            .sortBy(app => app.get('name').toLowerCase())
                            .toJS();
    return availableApps;
}

function getApplicationsFetchStatus(state) {
    return state.get(FETCH_STATE);
}

/**
 * Returns the application with `id`. Does not care about its state, e.g. whether or not
 * it's Pending or Failed. Returns null if there is no application with this id.
 *
 * @param  {object} state Current state of the store
 * @param  {String} id
 * @return {object} The application with this id
 */
function getApplication(state, id) {
    let app = state.getIn(['applications', id]);
    return app ?
            app.toJS() :
            false;
}

/**
 * Returns all versions for a given application
 *
 * @param  {object} state Current state of the store
 * @return {Array} Available versions
 */
function getApplicationVersions(state, id, filter) {
    let versions = state
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
 * @param  {object} state Current state of the store
 * @param  {String} id
 * @param  {String} ver
 * @return {object} The application version with this id and ver
 */
function getApplicationVersion(state, id, ver) {
    let version = state.getIn([id, ver]);
    return version ? version.toJS() : false;
}

function getLatestApplicationVersion(state, id) {
    let versions = getApplicationVersions(state, id);
    return versions.length ? versions[0] : false;
}

export {
    getApprovals,
    getApprovalTypes,
    getApplicationVersion,
    getApplications,
    getApplicationsFetchStatus,
    getApplication,
    getApplicationVersions,
    getApplicationVersion,
    getLatestApplicationVersion
};