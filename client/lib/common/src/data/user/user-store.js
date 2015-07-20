import {Store} from 'flummox';
import _m from 'mori';
import Config from 'common/src/config';

class UserStore extends Store {
    constructor(flux) {
        super();

        const userActions = flux.getActions('user');

        this.state = {
            tokeninfo: _m.hashMap(),
            uid: false,
            users: _m.hashMap(),
            teams: _m.vector(),
            accounts: _m.vector()
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
            userActions.fetchTeamMembership,
            null,
            this.receiveTeams,
            null);

        this.registerAsync(
            userActions.fetchAccounts,
            null,
            this.receiveAccounts,
            null);

        this.registerAsync(
            userActions.fetchUserInfo,
            null,
            this.receiveUserInfo,
            null);
    }

    receiveTeams(teams) {
        this.setState({
            teams: _m.toClj(teams)
        });
    }

    receiveUserInfo([user, info]) {
        this.setState({
            users: _m.assoc(this.state.users, user, _m.toClj(info))
        });
    }

    receiveAccounts(accounts) {
        this.setState({
            accounts: _m.toClj(accounts)
        });
    }

    getUserCloudAccounts() {
        return _m.toJs(this.state.accounts);
    }

    getTeamMemberships() {
        let teams = _m.toJs(this.state.teams);
        return teams
                .sort((a, b) => {
                    let aId = a.id,
                        bId = b.id;
                    return aId < bId ? -1 :
                            bId < aId ? 1 :
                                0;
                })
                .map(team => ({
                    id: team.id,
                    name: teams.id_name
                }));
    }

    getUserInfo(user) {
        let info;
        if (user) {
            // specific user
            info = _m.get(this.state.users, user, false);
        } else {
            // current user
            let {uid} = this.getTokenInfo();
            info = uid ? _m.get(this.state.users, uid, false) : false;
        }
        return _m.toJs(info);
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

    // QUICKFIX #133
    isWhitelisted() {
        let token = _m.toJs(this.state.tokeninfo);
        // ignore whitelist if it's empty
        if (Config.RESOURCE_WHITELIST.length === 0) {
            return true;
        }
        return token && Config.RESOURCE_WHITELIST.indexOf(token.uid) >= 0;
    }

    _empty() {
        this.setState({
            tokeninfo: _m.hashMap(),
            uid: false,
            users: _m.hashMap(),
            teams: _m.vector(),
            accounts: _m.vector()
        });
    }
}

export default UserStore;
