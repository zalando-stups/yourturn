import {FullstopStore} from './fullstop-store';

function getPagingInfo(state) {
    return state.get('pagingInfo').toJS();
}

function getViolation(state, violationId) {
    let violation = state.getIn(['violations', String(violationId)]);
    return violation ? violation.toJS() : false;
}

function getViolations(state) {
    let violations = state.get('violations').valueSeq();

    if (violations.count() === 0) {
        return [];
    }

    return violations
            .toJS();
}

function getSearchParams(state) {
    return state.get('searchParams').toJS();
}

function getViolationTypes(state) {
    return state.get('violationTypes').toJS();
}

function getViolationType(state, type) {
    return state.get('violationTypes').get(type).toJS();
}

function getViolationCount(state) {
    return state.get('violationCount').toJS();
}

function getViolationCountIn(state, account) {
    let current = state.get('violationCountIn').toJS();
    if (current[0] === account) {
        return current[1];
    }
    return [];
}

function getOwnTotal(state) {
    return state.get('ownAccountsTotal');
}

function getLastVisited(state) {
    return state.get('lastVisited');
}

function getDefaultSearchParams() {
    return (FullstopStore()).get('searchParams').toJS();
}

export {
    getViolations,
    getViolation,
    getPagingInfo,
    getSearchParams,
    getViolationType,
    getViolationTypes,
    getViolationCount,
    getViolationCountIn,
    getLastVisited,
    getOwnTotal,
    getDefaultSearchParams
};