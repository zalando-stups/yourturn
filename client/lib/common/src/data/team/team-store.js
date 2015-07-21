import {Store} from 'flummox';
import _m from 'mori';

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
            accounts: _m.toClj(accounts)
        });
    }

    getAccounts() {
        return _m.toJs(this.state.accounts)
                 .sort((a, b) => {
                    let aName = a.name.toLowerCase(),
                        bName = b.name.toLowerCase();
                    return aName < bName ?
                            -1 :
                            bName < aName ?
                                1 : 0;
                 });
    }

    _empty() {
        this.setState({
            accounts: _m.vector()
        });
    }
}

export default TeamStore;
