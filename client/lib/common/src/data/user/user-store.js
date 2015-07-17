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
            teams: _m.hashMap()
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
            userActions.fetchTeamDetails,
            null,
            this.receiveTeam,
            null);

        this.registerAsync(
            userActions.fetchUserInfo,
            null,
            this.receiveUserInfo,
            null);
    }

    receiveTeam(team) {
        this.setState({
            teams: _m.assoc(this.state.teams, team.id, _m.toClj(team))
        });
    }

    receiveUserInfo([user, info]) {
        this.setState({
            users: _m.assoc(this.state.users, user, _m.toClj(info))
        });
    }

    getUserCloudAccounts() {
        let teams = _m.toJs(this.state.teams);
        return Object
                .keys(teams)
                .map(t => teams[t]['infrastructure-accounts']
                            .map(acc => {
                                acc.team = t;
                                return acc;
                            }))
                .reduce((prev, cur) => {
                    prev = prev.concat(cur);
                    return prev;
                }, []);
    }

    getTeamMemberships() {
        let teams = _m.toJs(this.state.teams);
        return Object
                .keys(teams)
                .sort()
                .map(tId => ({
                    id: tId,
                    name: teams[tId].id_name
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
            teams: _m.hashMap()
        });
    }
}

export default UserStore;
