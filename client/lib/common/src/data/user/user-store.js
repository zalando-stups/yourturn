import {Store} from 'flummox';
import Immutable from 'immutable';
import Config from 'common/src/config';

class UserStore extends Store {
    constructor(flux) {
        super();

        const userActions = flux.getActions('user');

        this.state = {
            tokeninfo: Immutable.Map(),
            uid: false,
            users: Immutable.Map(),
            accounts: Immutable.List()
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

    receiveUserInfo([user, info]) {
        this.setState({
            users: this.state.users.set(user, Immutable.fromJS(info))
        });
    }

    receiveAccounts(accounts) {
        this.setState({
            accounts: Immutable.fromJS(accounts)
        });
    }

    getUserCloudAccounts() {
        return this.state.accounts.toJS();
    }

    getUserInfo(user) {
        let info;
        if (user) {
            // specific user
            info = this.state.users.get(user, false);
        } else {
            // current user
            let {uid} = this.getTokenInfo();
            info = uid ? this.state.users.get(uid, false) : false;
        }
        return info ? info.toJS() : false;
    }

    receiveTokenInfo(tokeninfo) {
        this.setState({
            tokeninfo: Immutable.fromJS(tokeninfo)
        });
    }

    getTokenInfo() {
        return this.state.tokeninfo ? this.state.tokeninfo.toJS() : false;
    }

    deleteTokenInfo() {
        this.setState({
            tokeninfo: false
        });
    }

    // QUICKFIX #133
    isWhitelisted() {
        let token = this.state.tokeninfo.toJS();
        // ignore whitelist if it's empty
        if (Config.RESOURCE_WHITELIST.length === 0) {
            return true;
        }
        return token && Config.RESOURCE_WHITELIST.indexOf(token.uid) >= 0;
    }

    _empty() {
        this.setState({
            tokeninfo: Immutable.Map(),
            uid: false,
            users: Immutable.Map(),
            accounts: Immutable.List()
        });
    }
}

export default UserStore;
