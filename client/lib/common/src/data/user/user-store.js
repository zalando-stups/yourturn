import {Store} from 'flummox';
import _m from 'mori';

class UserStore extends Store {
    constructor(flux) {
        super();

        const userActions = flux.getActions('user');

        this.state = {
            tokeninfo: _m.hashMap(),
            uid: false,
            teams: _m.vector()
        };

        this.register(
            userActions.deleteTokenInfo,
            this.deleteTokenInfo);

        this.registerAsync(
            userActions.fetchTokenInfo,
            null,
            this.receiveTokenInfo,
            null);

        this.registerAsync(
            userActions.fetchUserTeams,
            null,
            this.receiveUserTeams,
            null);
    }


    receiveUserTeams(teams) {
        this.setState({
            teams: _m.toClj(teams)
        });
    }

    getUserTeams() {
        return _m.toJs(this.state.teams);
    }

    receiveTokenInfo(tokeninfo) {
        this.setState({
            tokeninfo: _m.toClj(tokeninfo)
        });
    }

    getTokenInfo() {
        return _m.toJs(this.state.tokeninfo);
    }

    deleteTokenInfo() {
        this.setState({
            tokeninfo: false
        });
    }

    _empty() {
        this.setState({
            tokeninfo: _m.hashMap(),
            uid: false,
            teams: _m.vector()
        });
    }
}

export default UserStore;