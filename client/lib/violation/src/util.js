import moment from 'moment';
import {parse} from 'querystring';

function stringifySearchParams(searchParams) {
    let result = Object.assign({}, searchParams);
    Object.keys(result).forEach(k => {
        if (moment.isMoment(result[k])) {
            // dates have to parsed to timestamp again
            result[k] = result[k].toISOString();
        }
    });
    return result;
}

function parseSearchParams(searchParams) {
    let params = parse(searchParams.substring(1)),
        result = {};

    // global parameters
    if (params.accounts) {
        result.accounts = params.accounts;
        if (!Array.isArray(result.accounts)) {
            result.accounts = [result.accounts];
        }
    }
    if (params.from) {
        result.from = moment(params.from);
    }
    if (params.to) {
        result.to = moment(params.to);
    }
    if (params.activeTab) {
        result.activeTab = parseInt(params.activeTab, 10);
    }
    if (params.showUnresolved) {
        result.showUnresolved = params.showUnresolved === 'true';
    }
    if (params.showResolved) {
        result.showResolved = params.showResolved === 'true';
    }
    if (params.sortAsc) {
        result.sortAsc = params.sortAsc === 'true';
    }
    if (params.page) {
        result.page = parseInt(params.page, 10);
    }

    return result;
}

export {
    parseSearchParams,
    stringifySearchParams
};
