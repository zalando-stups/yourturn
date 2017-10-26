import fuzzysearch from 'fuzzysearch';
import {FETCH_STATE} from './application-store';

/**
 * Returns all applications that are available (as in not Pending or Failed) RIGHT NAO!
 *
 * @param  {object} state Current state of the store
 * @param  {string} term Filters list of applications by names that contain term
 * @return {Array} Available applications
 */
function getApplications(state, term, team) {
    let availableApps = state
                            .applications
                            .get('applications')
                            .valueSeq()
                            .filter(app => !app.getResult)
                            .filter(app => team ? app.get('team_id') === team : true)
                            .filter(app => term ?
                                            fuzzysearch(term.toLowerCase(), `${app.get('id').toLowerCase()} ${app.get('name').toLowerCase()} ${app.get('team_id').toLowerCase()}`) :
                                            true)
                            .sortBy(app => app.get('name').toLowerCase())
                            .toJS();
    return availableApps;
}

function getApplicationsFetchStatus(state) {
    return state.applications.get(FETCH_STATE);
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
    let app = state.applications.getIn(['applications', id]);
    return app ?
            app.toJS() :
            false;
}

function getPreferredAccount(state) {
    return state.applications.get('preferredAccount');
}

function getTabAccounts(state) {
    return state.applications.get('tabAccounts').toJS();
}

export {
    getApplications,
    getApplicationsFetchStatus,
    getApplication,
    getPreferredAccount,
    getTabAccounts
};
