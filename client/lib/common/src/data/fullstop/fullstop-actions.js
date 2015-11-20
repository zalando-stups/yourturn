import FULLSTOP_BASE_URL from 'FULLSTOP_BASE_URL';
// import {createAction} from 'redux-actions';
// import Types from './fullstop-types';
import request from 'common/src/superagent';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';
import {Actions} from 'flummox';
import Storage from 'common/src/storage';

function fetchOwnTotal(from, accounts) {
    return request
            .get(`${FULLSTOP_BASE_URL}/violations`)
            .accept('json')
            .query({
                accounts: accounts,
                from: new Date(from).toISOString(),
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
                accounts: params.accounts,
                size: params.size || 10,
                from: params.from ? params.from.toISOString() : '',
                to: (params.to || new Date()).toISOString(),
                page: params.page || 0,
                type: params.list_violationType || undefined,
                sort: 'created' + (params.sortAsc ? ',asc' : ',desc'),
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
                accounts: params.accounts,
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

function updateSearchParams(params) {
    return params;
}

function saveLastVisited(date) {
    Storage.set('fullstop_lastVisited', date);
    return date;
}

function loadLastVisited() {
    return Storage.get('fullstop_lastVisited') || 0;
}

// for now wrap in flummox actions
export default class FullstopActions extends Actions {
    resolveViolation() {
        return resolveViolation.apply(this, arguments);
    }

    fetchViolation() {
        return fetchViolation.apply(this, arguments);
    }

    fetchViolations() {
        return fetchViolations.apply(this, arguments);
    }

    fetchViolationTypes() {
        return fetchViolationTypes();
    }

    fetchViolationCount() {
        return fetchViolationCount.apply(this, arguments);
    }

    fetchViolationCountIn(account, params) {
        return fetchViolationCountIn(account, params);
    }

    fetchOwnTotal(from, accounts) {
        return fetchOwnTotal(from, accounts);
    }

    deleteViolations() {
        return deleteViolations();
    }

    updateSearchParams(params) {
        return updateSearchParams(params);
    }

    loadLastVisited() {
        return loadLastVisited();
    }

    saveLastVisited(date) {
        return saveLastVisited(date);
    }
}

/* this is for later, when all is redux */

// let fetchViolation = createAction(Types.FETCH_VIOLATION, _fetchViolation),
//     fetchViolations = createAction(Types.FETCH_VIOLATIONS, _fetchViolations),
//     resolveViolation = createAction(Types.RESOLVE_VIOLATION, _resolveViolation),
//     deleteViolations = createAction(Types.DELETE_VIOLATIONS);

export {
    fetchOwnTotal,
    fetchViolations,
    fetchViolation,
    fetchViolationTypes,
    fetchViolationCount,
    fetchViolationCountIn,
    resolveViolation,
    deleteViolations,
    updateSearchParams,
    fetchOwnTotal,
    saveLastVisited,
    loadLastVisited
};
