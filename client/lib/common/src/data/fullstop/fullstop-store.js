import {Store} from 'flummox';
import _m from 'mori';

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
    }

    beginFetchViolations() { }
    failFetchViolations() { }

    receiveViolations(violations) {
        let all = _m.into(this.state.violations, _m.toClj(violations));
        this.setState({
            violations: all
        });
    }

    getViolations(accounts) {
        let violations = _m.filter(v => accounts ? accounts.indexOf(v.get('account_id')) >= 0 : true,
                                   this.state.violations);
        return _m.toJs(violations);
    }

    _empty() {
        this.setState({
            violations: _m.hashMap()
        });
    }
}

export default FullstopStore;