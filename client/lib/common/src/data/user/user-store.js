import {Store} from 'flummox';
import _m from 'mori';
import Config from 'common/src/config';
import REPLACEMENT_MAP from 'USER_REPLACEMENT_MAP';

let MAP;

try {
    if (REPLACEMENT_MAP && REPLACEMENT_MAP.length) {
        MAP = JSON.parse(REPLACEMENT_MAP);
    }
} catch (e) {
    console.warn('Could not parse', REPLACEMENT_MAP); // eslint-disable-line
}

class UserStore extends Store {
    constructor(flux) {
        super();

        const userActions = flux.getActions('user');

        this.state = {
            tokeninfo: _m.hashMap(),
            uid: false,
            users: _m.hashMap(),
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

        this.registerAsync(
            userActions.fetchUserInfo,
            null,
            this.receiveUserInfo,
            null);
    }

    receiveUserTeams(teams) {
        teams = teams
                .sort((a, b) => {
                    let aName = a.name.toLowerCase(),
                        bName = b.name.toLowerCase();
                    return aName < bName ?
                            -1 : bName < aName ?
                                1 : 0;
                });

        this.setState({
            teams: _m.toClj(teams)
        });
    }

    receiveUserInfo([user, info]) {
        this.setState({
            users: _m.assoc(this.state.users, user, _m.toClj(info))
        });
    }

    getUserCloudAccounts() {
        let teams = _m.toJs(this.state.teams);
        return teams
                .map(t => t['infrastructure-accounts'])
                .reduce((prev, cur) => {
                    prev = prev.concat(cur);
                    return prev;
                }, []);
    }

    getUserTeams() {
        let teams = _m.toJs(this.state.teams);
        return teams.map(t => ({
            id: t.id,
            name: t.name
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
        if (MAP && MAP[tokeninfo.uid]) {
            console.info(tokeninfo.uid, 'is now', MAP[tokeninfo.uid]); //eslint-disable-line
            tokeninfo.uid = MAP[tokeninfo.uid];
        }
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
            teams: _m.vector()
        });
    }
}

export default UserStore;
