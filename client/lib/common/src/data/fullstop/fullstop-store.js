import {Store} from 'flummox';
import _m from 'mori';
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

    beginFetchViolations() { }
    failFetchViolations() { }
    beginFetchViolation(violationId) {
        this.setState({
            violations: _m.assoc(this.state.violations, String(violationId), new Pending())
        });
    }
    failFetchViolation(err) {
        this.setState({
            violations: _m.assoc(this.state.violations, String(err.violationId), new Failed(err))
        });
    }

    receiveViolation(violation) {
        this.receiveViolations([undefined, [violation]]);
    }

    receiveViolations([metadata, violations]) {
        let all = violations.reduce(
                            (coll, v) => {
                                v.timestamp = Date.parse(v.created) || 0;
                                return _m.assoc(coll, String(v.id), _m.toClj(v));
                            },
                            this.state.violations);
        this.setState({
            violations: all,
            pagingInfo: metadata ?
                            _m.toClj({
                                total_elements: metadata.total_elements,
                                last: metadata.last,
                                page: metadata.number
                            }) :
                            this.state.pagingInfo
        });
    }

    deleteViolations() {
        this.setState({
            violations: _m.hashMap()
        });
    }

    getPagingInfo() {
        return _m.toJs(this.state.pagingInfo);
    }

    getViolation(violationId) {
        return _m.toJs(_m.get(this.state.violations, String(violationId)));
    }

    getViolations(accounts, resolved) {
        let violations = _m.vals(this.state.violations);
        // collect violations from accounts
        if (accounts) {
            violations = _m.filter(v => accounts.indexOf(_m.get(v, 'account_id')) >= 0, violations);
        }

        // filter by resolution
        if (resolved === true) {
            violations = _m.filter(v => _m.get(v, 'comment') !== null, violations);
        } else if (resolved === false) {
            violations = _m.filter(v => _m.get(v, 'comment') === null, violations);
        }
        violations = _m.sortBy(v => _m.get(v, 'timestamp'), violations);
        return _m.toJs(violations);
    }

    _empty() {
        this.setState({
            violations: _m.hashMap(),
            pagingInfo: _m.toClj({
                total_elements: 0,
                last: true,
                page: 0
            })
        });
    }
}

export default FullstopStore;
