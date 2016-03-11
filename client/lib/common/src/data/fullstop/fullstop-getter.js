import FullstopStore from './fullstop-store';

function getPagingInfo(state) {
    return state.get('pagingInfo').toJS();
}

function getViolation(state, violationId) {
    let violations = state.get('violations');
    if (violations.size === 0) {
        return false;
    }
    violations = violations.filter(v => (v.get && v.get('id') === violationId));
    return violations.first() ? violations.first().toJS() : null;
}

function getViolations(state) {
    let violations = state.get('violations');

    if (violations.size === 0) {
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

function getDefaultSearchParams() {
    return (FullstopStore()).get('searchParams').toJS();
}

function getLoading(state) {
    return state.get('loadingViolations');
}

function getError(state) {
    return state.get('loadingError');
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
    getOwnTotal,
    getDefaultSearchParams,
    getLoading,
    getError
};