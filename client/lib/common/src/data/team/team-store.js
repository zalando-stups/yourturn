import {Store} from 'flummox';
import Immutable from 'immutable';
import Types from './team-types';
import * as Getter from './team-getter';

function TeamStore(state = Immutable.List(), action) {
    if (!action) {
        return state;
    }

    let {type, payload} = action;

    if (type === Types.RECEIVE_ACCOUNTS) {
        return Immutable.fromJS(payload);
    }

    return state;
}

export {
    TeamStore as TeamStore
};

class TeamStoreWrapper extends Store {
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
            redux: TeamStore(this.state.redux, {
                type: Types.RECEIVE_ACCOUNTS,
                payload: accounts
            })
        });
    }

    getAccounts() {
        return Getter.getAccounts(this.state.redux);
    }

    getAccount(id) {
        return Getter.getAccount(this.state.redux, id);
    }

    _empty() {
        this.setState({
            redux: TeamStore()
        });
    }
}

export default TeamStoreWrapper;
