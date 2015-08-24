import {Store} from 'flummox';
import Immutable from 'immutable';
import {Pending, Failed} from 'common/src/fetch-result';

class FullstopStore extends Store {
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

    beginFetchViolations() {
        this.setState({
            pagingInfo: Immutable.Map({
                last: true
            })
        });
    }
    failFetchViolations() { }
    beginFetchViolation(violationId) {
        this.setState({
            violations: this.state.violations.set(String(violationId), new Pending())
        });
    }
    failFetchViolation(err) {
        this.setState({
            violations: this.state.violations.set(String(err.violationId), new Failed(err))
        });
    }

    receiveViolation(violation) {
        this.receiveViolations([undefined, [violation]]);
    }

    receiveViolations([metadata, violations]) {
        let all = violations.reduce(
                            (coll, v) => {
                                v.timestamp = Date.parse(v.created) || 0;
                                return coll.set(String(v.id), Immutable.fromJS(v));
                            },
                            this.state.violations);
        this.setState({
            violations: all,
            pagingInfo: metadata ?
                            Immutable.Map({
                                last: metadata.last
                            }) :
                            this.state.pagingInfo
        });
    }

    deleteViolations() {
        this.setState({
            violations: Immutable.Map()
        });
    }

    getPagingInfo() {
        return this.state.pagingInfo.toJS();
    }

    getViolation(violationId) {
        let violation = this.state.violations.get(String(violationId));
        return violation ? violation.toJS() : false;
    }

    getViolations(accounts, resolved) {
        let violations = this.state.violations.valueSeq();
        // collect violations from accounts
        if (accounts) {
            violations = violations.filter(v => accounts.indexOf(v.get('account_id')) >= 0);
        }

        // filter by resolution
        if (resolved === true) {
            violations = violations.filter(v => v.get('comment') !== null);
        } else if (resolved === false) {
            violations = violations.filter(v => v.get('comment') === null);
        }
        return violations
                .sortBy(v => v.get('timestamp'))
                .toJS();
    }

    _empty() {
        this.setState({
            violations: Immutable.Map(),
            pagingInfo: Immutable.fromJS({
                last: true
            })
        });
    }
}

export default FullstopStore;
