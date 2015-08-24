import {Store} from 'flummox';
import Immutable from 'immutable';

class TeamStore extends Store {
    constructor(flux) {
        super();

        const teamActions = flux.getActions('team');

        this._empty();

        this.registerAsync(
            teamActions.fetchAccounts,
            null,
            this.receiveAccounts,
            null);
    }

    receiveAccounts(accounts) {
        this.setState({
            accounts: Immutable.fromJS(accounts)
        });
    }

    getAccounts() {
        return this.state.accounts
                .sortBy(a => a.get('name').toLowerCase())
                .toJS();
    }

    _empty() {
        this.setState({
            accounts: Immutable.List()
        });
    }
}

export default TeamStore;
