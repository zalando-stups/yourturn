import Immutable from 'immutable';
import moment from 'moment';
import {Pending, Failed} from 'common/src/fetch-result';
import Types from './fullstop-types';
import * as Getters from './fullstop-getter';

const DEFAULT_PAGING = {
        last: true
    },
    DEFAULT_STATE = Immutable.fromJS({
        ownAccountsTotal: 0,
        lastVisited: 0,
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
            showResolved: false,
            sortAsc: true,
            activeTab: 0
        }
    });

function FullstopStore(state, action) {
    if (!state || !action) {
        return DEFAULT_STATE;
    }

    let {type, payload} = action;
    if (type === Types.BEGIN_FETCH_VIOLATIONS) {
        return state.set('pagingInfo', Immutable.Map(DEFAULT_PAGING));
    } else if (type === Types.BEGIN_FETCH_VIOLATION) {
        return state.setIn(['violations', String(payload[0])], new Pending());
    } else if (type === Types.FAIL_FETCH_VIOLATION) {
        return state.setIn(['violations', String(payload.violationId)], new Failed(payload));
    } else if (type === Types.FETCH_VIOLATION || type === Types.RESOLVE_VIOLATION) {
        return FullstopStore(state, {
            type: Types.FETCH_VIOLATIONS,
            payload: [undefined, [payload]]
        });
    } else if (type === Types.FETCH_VIOLATIONS) {
        let [metadata, violations] = payload,
            all = violations.reduce(
                (coll, v) => {
                    v.timestamp = Date.parse(v.created) || 0;
                    return coll.set(String(v.id), Immutable.fromJS(v));
                },
                state.get('violations'));
        if (metadata) {
            state = state.set('pagingInfo', Immutable.Map({
                last: metadata.last,
                page: metadata.number,
                total: metadata.total_elements
            }));
        }
        return state.set('violations', all);
    } else if (type === Types.DELETE_VIOLATIONS) {
        return state.set('violations', Immutable.Map());
    } else if (type === Types.FETCH_VIOLATION_TYPES) {
        let types = payload.reduce((all, t) => {
            all[t.id] = t;
            return all;
        },
        {});
        return state.set('violationTypes', Immutable.fromJS(types));
    } else if (type === Types.FETCH_VIOLATION_COUNT) {
        return state.set('violationCount', Immutable.fromJS(payload));
    } else if (type === Types.FETCH_VIOLATION_COUNT_IN) {
        return state.set('violationCountIn', Immutable.fromJS(payload));
    } else if (type === Types.FETCH_OWN_TOTAL) {
        return state.set('ownAccountsTotal', payload);
    } else if (type === Types.LOAD_LAST_VISITED) {
        return state.set('lastVisited', payload);
    }
    return state;
}

export default FullstopStore;
