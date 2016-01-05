import _ from 'lodash';
import {Actions} from 'flummox';
import request from 'common/src/superagent';
import {Services} from 'common/src/data/services';
import {combineActions, flummoxCompatWrap} from 'common/src/util';
import {createAction} from 'redux-actions';
import Type from './essentials-types';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

function fetchScopes(resourceId) {
    return request
            .get(`${Services.essentials.url}${Services.essentials.root}/${resourceId}/scopes`)
            .accept('json')
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => [resourceId, res.body]);
}

function saveResource(resourceId, resource) {
    let copy = _.extend({}, resource);
    copy.id = undefined;
    return request
            .put(`${Services.essentials.url}${Services.essentials.root}/${resourceId}`)
            .type('json')
            .accept('json')
            .oauth(Provider, RequestConfig)
            .send(copy)
            .exec(saveRoute)
            .catch(err => {
                err.id = resourceId;
                throw err;
            });
}

function saveScope(resourceId, scopeId, scope) {
    let copy = _.extend({}, scope);
    copy.id = undefined;
    return request
            .put(`${Services.essentials.url}${Services.essentials.root}/${resourceId}/scopes/${scopeId}`)
            .type('json')
            .accept('json')
            .oauth(Provider, RequestConfig)
            .send(copy)
            .exec(saveRoute)
            .catch(err => {
                err.id = scopeId;
                throw err;
            });
}

function fetchResource(resourceId) {
    return request
            .get(`${Services.essentials.url}${Services.essentials.root}/${resourceId}`)
            .accept('json')
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => res.body)
            .catch(err => {
                err.id = resourceId;
                throw err;
            });
}

function fetchResources() {
    return request
            .get(`${Services.essentials.url}${Services.essentials.root}`)
            .accept('json')
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => res.body);
}

function fetchScope(resourceId, scopeId) {
    return request
            .get(`${Services.essentials.url}${Services.essentials.root}/${resourceId}/scopes/${scopeId}`)
            .accept('json')
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => [resourceId, res.body])
            .catch(err => {
                err.id = resourceId;
                throw err;
            });
}

function fetchScopeApplications(resourceId, scopeId) {
    return request
            .get(`${Services.mint.url}${Services.mint.root}`)
            .query({
                resource_type_id: resourceId,
                scope_id: scopeId
            })
            .accept('json')
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => [resourceId, scopeId, res.body])
            .catch(err => {
                err.id = resourceId;
                throw err;
            });
}

let fetchScopesAction = flummoxCompatWrap(createAction(Type.FETCH_SCOPES, fetchScopes)),
    fetchAllScopesAction = combineActions(
                            createAction(Type.FETCH_RESOURCES, fetchResources),
                            createAction(Type.FETCH_SCOPES, fetchScopes),
                            (resources, fetchScopesAction) => resources.map(resource => fetchScopesAction(resource.id))),
    saveResourceAction = createAction(Type.SAVE_RESOURCE, saveResource),
    saveScopeAction = createAction(Type.SAVE_SCOPE, saveScope),
    fetchResourceAction = flummoxCompatWrap(createAction(Type.FETCH_RESOURCE, fetchResource)),
    fetchResourcesAction = flummoxCompatWrap(createAction(Type.FETCH_RESOURCES, fetchResources)),
    fetchScopeAction = flummoxCompatWrap(createAction(Type.FETCH_SCOPE, fetchScope)),
    fetchScopeApplicationsAction = flummoxCompatWrap(createAction(Type.FETCH_SCOPE_APPLICATIONS, fetchScopeApplications));

export {
    fetchAllScopesAction as fetchAllScopes,
    fetchScopesAction as fetchScopes,
    saveResourceAction as saveResource,
    saveScopeAction as saveScope,
    fetchResourceAction as fetchResource,
    fetchResourcesAction as fetchResources,
    fetchScopeAction as fetchScope,
    fetchScopeApplicationsAction as fetchScopeApplications
};
