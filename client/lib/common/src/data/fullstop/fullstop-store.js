import Immutable from 'immutable';
import moment from 'moment';
import {Pending, Failed} from 'common/src/fetch-result';
import Types from './fullstop-types';
import * as Getters from './fullstop-getter';
import {Store} from 'flummox';

const DEFAULT_PAGING = {
    last: true
};

function FullstopStore(state, action) {
    if (!action || action.type === '@@INIT') {
        return Immutable.fromJS({
            violations: {},
            violationCount: [],
            violationCountIn: [],
            violationTypes: {},
            pagingInfo: DEFAULT_PAGING,
            searchParams: {
                page: 0,
                accounts: [],
                from: moment().subtract(1, 'week').startOf('day'),
                to: moment(),
                showUnresolved: true,
                showResolved: false
            }
        });
    }

    let {type, payload} = action;
    if (type === Types.BEGIN_FETCH_VIOLATIONS) {
        return state.set('pagingInfo', Immutable.Map(DEFAULT_PAGING));
    } else if (type === Types.BEGIN_FETCH_VIOLATION) {
        return state.setIn(['violations', String(payload)], new Pending());
    } else if (type === Types.FAIL_FETCH_VIOLATION) {
        return state.setIn(['violations', String(payload.violationId)], new Failed(payload));
    } else if (type === Types.RECEIVE_VIOLATION) {
        return FullstopStore(state, {
            type: Types.RECEIVE_VIOLATIONS,
            payload: [undefined, [payload]]
        });
    } else if (type === Types.RECEIVE_VIOLATIONS) {
        let [metadata, violations] = payload,
            all = violations.reduce(
                (coll, v) => {
                    v.timestamp = Date.parse(v.created) || 0;
                    return coll.set(String(v.id), Immutable.fromJS(v));
                },
                state.get('violations'));
        state = state.set('violations', all);
        if (metadata) {
            state = state.set('pagingInfo', Immutable.Map({
                last: metadata.last
            }));
        }
        return state;
    } else if (type === Types.DELETE_VIOLATIONS) {
        return state.set('violations', Immutable.Map());
    } else if (type === Types.UPDATE_SEARCH_PARAMS) {
        let currentParams = state.get('searchParams');
        Object
        .keys(payload)
        .forEach(param => {
            currentParams = currentParams.set(param, payload[param]);
        });
        return state.set('searchParams', currentParams);
    } else if (type === Types.RECEIVE_VIOLATION_TYPES) {
        let types = payload.reduce((all, t) => {
            all[t.id] = t;
            return all;
        },
        {});
        return state.set('violationTypes', Immutable.fromJS(types));
    } else if (type === Types.RECEIVE_VIOLATION_COUNT) {
        return state.set('violationCount', Immutable.fromJS(payload));
    } else if (type === Types.RECEIVE_VIOLATION_COUNT_IN) {
        return state.set('violationCountIn', Immutable.fromJS(payload));
    }
    return state;
}

export {
    FullstopStore as FullstopStore
};

// wrap in flummox store
export default class FullstopStoreWrapper extends Store {
    constructor(flux) {
        super();

        const fullstopActions = flux.getActions('fullstop');

        this._empty();

        this.register(
            fullstopActions.deleteViolations,
            this.deleteViolations);

        this.registerAsync(
            fullstopActions.fetchViolations,
            this.beginFetchViolations,
            this.receiveViolations,
            this.failFetchViolations);

        this.registerAsync(
            fullstopActions.fetchViolationTypes,
            null,
            this.receiveViolationTypes,
            null);

        this.registerAsync(
            fullstopActions.fetchViolationCount,
            null,
            this.receiveViolationCount,
            null);

        this.registerAsync(
            fullstopActions.fetchViolationCountIn,
            null,
            this.receiveViolationCountIn,
            null);

        this.registerAsync(
            fullstopActions.fetchViolation,
            this.beginFetchViolation,
            this.receiveViolation,
            this.failFetchViolation);

        this.registerAsync(
            fullstopActions.resolveViolation,
            this.beginFetchViolation,
            this.receiveViolation,
            this.failFetchViolation);

        this.register(
            fullstopActions.updateSearchParams,
            this.receiveSearchParams);
    }

    _empty() {
        this.state = {
            redux: FullstopStore()
        };
    }

    deleteViolations() {
        this.setState({
            redux: FullstopStore(this.state.redux, {
                type: Types.DELETE_VIOLATIONS
            })
        });
    }

    beginFetchViolations() {
        this.setState({
            redux: FullstopStore(this.state.redux, {
                type: Types.BEGIN_FETCH_VIOLATIONS
            })
        });
    }

    failFetchViolations() {
    }

    receiveViolations([metadata, violations]) {
        this.setState({
            redux: FullstopStore(this.state.redux, {
                type: Types.RECEIVE_VIOLATIONS,
                payload: [metadata, violations]
            })
        });
    }

    beginFetchViolation(id) {
        this.setState({
            redux: FullstopStore(this.state.redux, {
                type: Types.BEGIN_FETCH_VIOLATION,
                payload: id
            })
        });
    }

    failFetchViolation(err) {
        this.setState({
            redux: FullstopStore(this.state.redux, {
                type: Types.FAIL_FETCH_VIOLATION,
                payload: err
            })
        });
    }

    receiveViolation(violation) {
        this.setState({
            redux: FullstopStore(this.state.redux, {
                type: Types.RECEIVE_VIOLATION,
                payload: violation
            })
        });
    }

    receiveSearchParams(params) {
        this.setState({
            redux: FullstopStore(this.state.redux, {
                type: Types.UPDATE_SEARCH_PARAMS,
                payload: params
            })
        });
    }

    receiveViolationTypes(types) {
        this.setState({
            redux: FullstopStore(this.state.redux, {
                type: Types.RECEIVE_VIOLATION_TYPES,
                payload: types
            })
        });
    }

    receiveViolationCount(counts) {
        this.setState({
            redux: FullstopStore(this.state.redux, {
                type: Types.RECEIVE_VIOLATION_COUNT,
                payload: counts
            })
        });
    }

    receiveViolationCountIn([account, counts]) {
        this.setState({
            redux: FullstopStore(this.state.redux, {
                type: Types.RECEIVE_VIOLATION_COUNT_IN,
                payload: [account, counts]
            })
        });
    }

    getPagingInfo() {
        return Getters.getPagingInfo(this.state.redux);
    }

    getViolation(violationId) {
        return Getters.getViolation(this.state.redux, violationId);
    }

    getViolations(accounts, resolved) {
        return Getters.getViolations(this.state.redux, accounts, resolved);
    }

    getSearchParams() {
        return Getters.getSearchParams(this.state.redux);
    }

    getViolationTypes() {
        return Getters.getViolationTypes(this.state.redux);
    }

    getViolationType(type) {
        return Getters.getViolationType(this.state.redux, type);
    }

    getViolationCount() {
        return Getters.getViolationCount(this.state.redux);
    }

    getViolationCountIn(account) {
        return Getters.getViolationCountIn(this.state.redux, account);
    }
}
