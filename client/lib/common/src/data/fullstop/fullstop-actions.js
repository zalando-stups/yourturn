import FULLSTOP_BASE_URL from 'FULLSTOP_BASE_URL';
// import {createAction} from 'redux-actions';
// import Types from './fullstop-types';
import request from 'common/src/superagent';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';
import {Actions} from 'flummox';

function fetchViolations(params) {
    return request
            .get(`${FULLSTOP_BASE_URL}/violations`)
            .accept('json')
            .query({
                accounts: params.accounts,
                size: params.size || 10,
                since: params.from ? params.from.toISOString() : '',
                page: params.page || 0
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
    console.log(params);
    return request
            .get(`${FULLSTOP_BASE_URL}/violation-count`)
            .query({
                accounts: params.accounts,
                to: params.to ? params.to.toISOString() : (new Date()).toISOString(),
                from: params.from ? params.from.toISOString() : ''
            })
            .accept('json')
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => res.body);
}

function deleteViolations() {
    return true;
}

function updateSearchParams(params) {
    return params;
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

    deleteViolations() {
        return deleteViolations();
    }

    updateSearchParams(params) {
        return updateSearchParams(params);
    }
}

/* this is for later, when all is redux */

// let fetchViolation = createAction(Types.FETCH_VIOLATION, _fetchViolation),
//     fetchViolations = createAction(Types.FETCH_VIOLATIONS, _fetchViolations),
//     resolveViolation = createAction(Types.RESOLVE_VIOLATION, _resolveViolation),
//     deleteViolations = createAction(Types.DELETE_VIOLATIONS);

export {
    fetchViolations,
    fetchViolation,
    fetchViolationTypes,
    fetchViolationCount,
    resolveViolation,
    deleteViolations,
    updateSearchParams
};
