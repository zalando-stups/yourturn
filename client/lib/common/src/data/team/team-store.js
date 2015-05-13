import {Store} from 'flummox';
import _m from 'mori';

class TeamStore extends Store {
    constructor(flux) {
        super();

        const teamActions = flux.getActions('team');

        this.state = {
            users: _m.hashMap()
        };

        this.registerAsync(
            teamActions.fetchUserTeams,
            null,
            this.receiveUserTeams,
            null);
    }

    receiveUserTeams([userId, teams]) {
        this.setState({
            users: _m.assoc(this.state.users, userId, _m.toClj(teams))
        });
    }

    getUserTeams(userId) {
        return _m.toJs(_m.get(this.state.users, userId));
    }

    /**
     * Only for testing!
     */
    _empty() {
        this.setState({
            users: _m.hashMap()
        });
    }
}

export default TeamStore;
