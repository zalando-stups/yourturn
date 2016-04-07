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
    copy.criticality_level = undefined;
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

function saveApplicationCriticality(id, criticality) {
    return request
            .put(`${Services.kio.url}${Services.kio.root}/${id}/criticality`)
            .type('json')
            .accept('json')
            .send({
                criticality_level: criticality
            })
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => res.body)
            .catch(err => {
                err.id = id;
                throw err;
            });
}

function fetchApplicationVersions(id) {
    return request
            .get(`${Services.kio.url}${Services.kio.root}/${id}/versions`)
            .accept('json')
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => res.body)
            .catch(err => {
                err.id = id;
                throw err;
            });
}

function fetchLatestApplicationVersions(team) {
    return request
            .get(ENV_DEVELOPMENT ? `http://localhost:8080/latestVersions/${team}` : `/latestVersions/${team}`)
            .accept('json')
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => res.body)
            .catch(err => {
                err.team = team;
                throw err;
            });
}

function fetchApplicationVersion(id, ver) {
    return request
            .get(`${Services.kio.url}${Services.kio.root}/${id}/versions/${ver}`)
            .accept('json')
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => res.body)
            .catch(err => {
                err.id = id;
                err.ver = ver;
                throw err;
            });
}

function saveApplicationVersion(applicationId, versionId, version) {
    let copy = _.extend({}, version);
    copy.id = undefined;
    return request
            .put(`${Services.kio.url}${Services.kio.root}/${applicationId}/versions/${versionId}`)
            .type('json')
            .accept('json')
            .send(copy)
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => res.body)
            .catch(err => {
                err.applicationId = applicationId;
                err.versionId = versionId;
                throw err;
            });
}

function fetchApprovalTypes(applicationId) {
    return request
            .get(`${Services.kio.url}${Services.kio.root}/${applicationId}/approvals`)
            .accept('json')
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => [
                applicationId,
                // specification, test, deploy and code change always have to be there
                (res.body.concat(['SPECIFICATION', 'TEST', 'DEPLOY', 'CODE_CHANGE']))
                    .filter((i, idx, arr) => arr.lastIndexOf(i) === idx)
                    .sort()
            ])
            .catch(err => {
                err.applicationId = applicationId;
                throw err;
            });
}

function fetchApprovals(applicationId, versionId) {
    return request
            .get(`${Services.kio.url}${Services.kio.root}/${applicationId}/versions/${versionId}/approvals`)
            .accept('json')
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => [applicationId, versionId, res.body])
            .catch(err => {
                err.applicationId = applicationId;
                err.versionId = versionId;
                throw err;
            });
}

function saveApproval(applicationId, versionId, approval) {
    return request
            .post(`${Services.kio.url}${Services.kio.root}/${applicationId}/versions/${versionId}/approvals`)
            .type('json')
            .accept('json')
            .send(approval)
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => res.body)
            .catch(err => {
                err.applicationId = applicationId;
                err.versionId = versionId;
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
    saveAppCritAction = createAction(Type.SAVE_APPLICATION_CRITICALITY, saveApplicationCriticality),
    fetchLatestVersAction = createAction(Type.FETCH_APPLICATION_VERSIONS, fetchLatestApplicationVersions),
    fetchVersAction = createAction(Type.FETCH_APPLICATION_VERSIONS, fetchApplicationVersions),
    fetchVerAction = flummoxCompatWrap(createAction(Type.FETCH_APPLICATION_VERSION, fetchApplicationVersion)),
    saveVerAction = createAction(Type.SAVE_APPLICATION_VERSION, saveApplicationVersion),
    fetchApprovalTypesAction = createAction(Type.FETCH_APPROVAL_TYPES, fetchApprovalTypes),
    fetchApprovalsAction = createAction(Type.FETCH_APPROVALS, fetchApprovals),
    saveApprovalAction = createAction(Type.SAVE_APPROVAL, saveApproval),
    loadPreferredAccountAction = createAction(Type.LOAD_PREFERRED_ACCOUNT, loadPreferredAccount),
    savePreferredAccountAction = createAction(Type.SAVE_PREFERRED_ACCOUNT, savePreferredAccount),
    loadTabAccountsAction = createAction(Type.LOAD_TAB_ACCOUNTS, loadTabAccounts),
    saveTabAccountsAction = createAction(Type.SAVE_TAB_ACCOUNTS, saveTabAccounts);

export {
    fetchAppsAction as fetchApplications,
    fetchAppAction as fetchApplication,
    saveAppAction as saveApplication,
    saveAppCritAction as saveApplicationCriticality,
    fetchLatestVersAction as fetchLatestApplicationVersions,
    fetchVersAction as fetchApplicationVersions,
    fetchVerAction as fetchApplicationVersion,
    saveVerAction as saveApplicationVersion,
    fetchApprovalTypesAction as fetchApprovalTypes,
    fetchApprovalsAction as fetchApprovals,
    saveApprovalAction as saveApproval,
    loadPreferredAccountAction as loadPreferredAccount,
    savePreferredAccountAction as savePreferredAccount,
    loadTabAccountsAction as loadTabAccounts,
    saveTabAccountsAction as saveTabAccounts
};
