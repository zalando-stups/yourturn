import FULLSTOP_BASE_URL from 'FULLSTOP_BASE_URL';
import {createAction} from 'redux-actions';
import Type from './fullstop-types';
import request from 'common/src/superagent';
import {flummoxCompatWrap} from 'common/src/redux-middlewares';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

function fetchOwnTotal(accounts) {
    return request
            .get(`${FULLSTOP_BASE_URL}/violations`)
            .accept('json')
            .query({
                accounts: accounts && accounts.join(','),
                from: new Date(0).toISOString(),
                checked: false
            })
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => res.body.total_elements);
}

function fetchViolations(params) {
    return request
            .get(`${FULLSTOP_BASE_URL}/violations`)
            .accept('json')
            .query({
                accounts: params.accounts && params.accounts.join(','),
                size: params.size || 10,
                from: params.from ? params.from.toISOString() : '',
                to: (params.to || new Date()).toISOString(),
                page: params.page || 0,
                type: params.type || undefined,
                priority: typeof params.priority !== 'undefined' ? params.priority : undefined,
                sort: (params.sortBy || 'created') + (params.sortAsc ? ',asc' : ',desc'),
                whitelisted: params.showWhitelisted || false,
                checked: params.showResolved && !params.showUnresolved ?
                            true :
                            !params.showResolved && params.showUnresolved ?
                                false :
                                undefined
            })
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => [res.body, res.body.content]);
}

function fetchViolation(violationId) {
    return request
            .get(`${FULLSTOP_BASE_URL}/violations/${violationId}`)
            .accept('json')
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => res.body)
            .catch(e => {
                e.violationId = violationId;
                throw e;
            });
}

function resolveViolation(violationId, message) {
    return request
            .post(`${FULLSTOP_BASE_URL}/violations/${violationId}/resolution`)
            .accept('json')
            .type('text/plain')
            .send(message)
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => res.body);
}

function fetchViolationTypes() {
    return request
            .get(`${FULLSTOP_BASE_URL}/violation-types`)
            .accept('json')
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => res.body);
}

function fetchViolationCount(params) {
    return request
            .get(`${FULLSTOP_BASE_URL}/violation-count`)
            .query({
                accounts: params.accounts && params.accounts.join(','),
                to: params.to ? params.to.toISOString() : (new Date()).toISOString(),
                from: params.from ? params.from.toISOString() : '',
                resolved: params.showResolved && !params.showUnresolved ?
                            true :
                            !params.showResolved && params.showUnresolved ?
                                false :
                                undefined
            })
            .accept('json')
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => res.body);
}

function fetchViolationCountIn(account, params) {
    return request
            .get(`${FULLSTOP_BASE_URL}/violation-count/${account}`)
            .query({
                to: (params.to || new Date()).toISOString(),
                from: params.from ? params.from.toISOString() : '',
                resolved: params.showResolved && !params.showUnresolved ?
                            true :
                            !params.showResolved && params.showUnresolved ?
                                false :
                                undefined
            })
            .accept('json')
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => [account, res.body]);
}

function deleteViolations() {
    return true;
}

let fetchViolationAction = flummoxCompatWrap(createAction(Type.FETCH_VIOLATION, fetchViolation)),
    fetchViolationsAction = flummoxCompatWrap(createAction(Type.FETCH_VIOLATIONS, fetchViolations)),
    resolveViolationAction = createAction(Type.RESOLVE_VIOLATION, resolveViolation),
    deleteViolationsAction = createAction(Type.DELETE_VIOLATIONS),
    fetchViolationTypesAction = createAction(Type.FETCH_VIOLATION_TYPES, fetchViolationTypes),
    fetchViolationCountAction = createAction(Type.FETCH_VIOLATION_COUNT, fetchViolationCount),
    fetchViolationCountInAction = createAction(Type.FETCH_VIOLATION_COUNT_IN, fetchViolationCountIn),
    fetchOwnTotalAction = createAction(Type.FETCH_OWN_TOTAL, fetchOwnTotal);

export {
    fetchOwnTotalAction as fetchOwnTotal,
    fetchViolationsAction as fetchViolations,
    fetchViolationAction as fetchViolation,
    fetchViolationTypesAction as fetchViolationTypes,
    fetchViolationCountAction as fetchViolationCount,
    fetchViolationCountInAction as fetchViolationCountIn,
    resolveViolationAction as resolveViolation,
    deleteViolationsAction as deleteViolations
};
