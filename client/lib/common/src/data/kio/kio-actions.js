/* global ENV_DEVELOPMENT */
import _ from 'lodash';
import {createAction} from 'redux-actions';
import Type from './kio-types';
import {flummoxCompatWrap} from 'common/src/redux-middlewares';
import request from 'common/src/superagent';
import {Services} from 'common/src/data/services';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';
import Storage from 'common/src/storage';

function fetchApplications(team) {
    return request
            .get(`${Services.kio.url}${Services.kio.root}` + (team ? `?team_id=${team}` : ''))
            .accept('json')
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => res.body);
}

function fetchApplication(id) {
    return request
            .get(`${Services.kio.url}${Services.kio.root}/${id}`)
            .accept('json')
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => res.body)
            .catch(err => {
                err.id = id;
                throw err;
            });
}

function saveApplication(id, app) {
    let copy = _.extend({}, app);
    // remove fields not liked by kio
    copy.id = undefined;
    copy.created = undefined;
    copy.created_by = undefined;
    copy.last_modified = undefined;
    copy.last_modified_by = undefined;
    return request
            .put(`${Services.kio.url}${Services.kio.root}/${id}`)
            .type('json')
            .accept('json')
            .send(copy)
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => res.body)
            .catch(err => {
                err.id = id;
                throw err;
            });
}

function savePreferredAccount(acc) {
    Storage.set('kio_preferredAccount', acc);
    return acc;
}

function loadPreferredAccount() {
    return Storage.get('kio_preferredAccount') || false;
}

function saveTabAccounts(accs) {
    Storage.set('kio_tabAccounts', accs);
    return accs;
}

function loadTabAccounts() {
    return Storage.get('kio_tabAccounts') || [];
}

let fetchAppsAction = flummoxCompatWrap(createAction(Type.FETCH_APPLICATIONS, fetchApplications)),
    fetchAppAction = flummoxCompatWrap(createAction(Type.FETCH_APPLICATION, fetchApplication)),
    saveAppAction = createAction(Type.SAVE_APPLICATION, saveApplication),
    loadPreferredAccountAction = createAction(Type.LOAD_PREFERRED_ACCOUNT, loadPreferredAccount),
    savePreferredAccountAction = createAction(Type.SAVE_PREFERRED_ACCOUNT, savePreferredAccount),
    loadTabAccountsAction = createAction(Type.LOAD_TAB_ACCOUNTS, loadTabAccounts),
    saveTabAccountsAction = createAction(Type.SAVE_TAB_ACCOUNTS, saveTabAccounts);

export {
    fetchAppsAction as fetchApplications,
    fetchAppAction as fetchApplication,
    saveAppAction as saveApplication,
    loadPreferredAccountAction as loadPreferredAccount,
    savePreferredAccountAction as savePreferredAccount,
    loadTabAccountsAction as loadTabAccounts,
    saveTabAccountsAction as saveTabAccounts
};
