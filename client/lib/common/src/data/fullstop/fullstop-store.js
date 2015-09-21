import Immutable from 'immutable';
import {Pending, Failed} from 'common/src/fetch-result';
import Types from './fullstop-types';
import * as Getters from './fullstop-getter';
import {Store} from 'flummox';

function FullstopStore(state, action) {
    let {type, payload} = action;
    if (type === Types.BEGIN_FETCH_VIOLATIONS) {
        return state.set('pagingInfo', Immutable.Map({ last: true }));
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
            state = state.set('pagingInfo', Immutable.Map({ last: metadata.last }));
        }
        return state;
    } else if (type === Types.DELETE_VIOLATIONS) {
        return state.set('violations', Immutable.Map());
    } else if (type === '@@INIT') {
        return Immutable.fromJS({
            violations: {},
            pagingInfo: {
                last: true
            }
        });
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
            fullstopActions.fetchViolation,
            this.beginFetchViolation,
            this.receiveViolation,
            this.failFetchViolation);

        this.registerAsync(
            fullstopActions.resolveViolation,
            this.beginFetchViolation,
            this.receiveViolation,
            this.failFetchViolation);
    }

    _empty() {
        this.state = {
            redux: FullstopStore(undefined, {
                type: '@@INIT'
            })
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

    getPagingInfo() {
        return Getters.getPagingInfo(this.state.redux);
    }

    getViolation(violationId) {
        return Getters.getViolation(this.state.redux, violationId);
    }

    getViolations(accounts, resolved) {
        return Getters.getViolations(this.state.redux, accounts, resolved);
    }
}
