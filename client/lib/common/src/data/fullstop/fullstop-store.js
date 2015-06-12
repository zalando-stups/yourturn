import {Store} from 'flummox';
import _m from 'mori';
import _ from 'lodash';

class FullstopStore extends Store {
    constructor(flux) {
        super();

        const fullstopActions = flux.getActions('fullstop');

        this.state = {
            violations: _m.vector()
        };

        this.registerAsync(
            fullstopActions.fetchViolations,
            this.beginFetchViolations,
            this.receiveViolations,
            this.failFetchViolations);

        this.registerAsync(
            fullstopActions.resolveViolation,
            this.beginFetchViolation,
            this.receiveViolation,
            this.failFetchViolation);
    }

    beginFetchViolations() { }
    failFetchViolations() { }
    beginFetchViolation() { }
    failFetchViolation() { }

    receiveViolation(violation) {
        this.receiveViolations([violation]);
    }

    receiveViolations(violations) {
        let all = _m.toJs(_m.into(this.state.violations, _m.toClj(violations)));
        all.forEach(v => v.timestamp = Date.parse(v.created) || 0);
        // sorry, with mori there always was an infinite loop
        // dedup
        all = all.filter((v, i, array) => _.findLastIndex(array, a => a.id === v.id) === i);

        this.setState({
            violations: _m.toClj(all)
        });
    }

    getViolation(violationId) {
        let coll = this.state.violations;
        return _m.toJs(_m.first(_m.filter(v => _m.get(v, 'id') === violationId, coll)));
    }

    getViolations(accounts, resolved) {
        let violations = _m.filter(v => accounts ?
                                            accounts.indexOf(_m.get(v, 'account_id')) >= 0 :
                                            true,
                                        this.state.violations);

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
            violations: _m.vector()
        });
    }
}

export default FullstopStore;