import {Store} from 'flummox';
import Immutable from 'immutable';
import Types from './user-types';
import * as Getter from './user-getter';

function UserStore(state, action) {
    const DEFAULT_STATE = Immutable.fromJS({
        tokeninfo: {},
        uid: false,
        users: {},
        accounts: []
    });

    if (!state) {
        return DEFAULT_STATE;
    }

    if (!action) {
        return state;
    }

    let {type, payload} = action;

    if (type === Types.RECEIVE_USERINFO) {
        let [user, info] = payload;
        return state.setIn(['users', user], Immutable.fromJS(info));
    } else if (type === Types.RECEIVE_TOKENINFO) {
        return state.set('tokeninfo', Immutable.fromJS(payload));
    } else if (type === Types.RECEIVE_ACCOUNTS) {
        return state.set('accounts', Immutable.fromJS(payload));
    } else if (type === Types.DELETE_TOKENINFO) {
        return state.set('tokeninfo', false);
    } else if (type === '@@INIT') {
        return DEFAULT_STATE;
    }

    return state;
}

export {
    UserStore as UserStore
};

class UserStoreWrapper extends Store {
    constructor(flux) {
        super();

        const userActions = flux.getActions('user');

        this._empty();

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
            redux: UserStore(this.state.redux, {
                type: Types.RECEIVE_USERINFO,
                payload: [user, info]
            })
        });
    }

    receiveAccounts(accounts) {
        this.setState({
            redux: UserStore(this.state.redux, {
                type: Types.RECEIVE_ACCOUNTS,
                payload: accounts
            })
        });
    }

    receiveTokenInfo(tokeninfo) {
        this.setState({
            redux: UserStore(this.state.redux, {
                type: Types.RECEIVE_TOKENINFO,
                payload: tokeninfo
            })
        });
    }

    deleteTokenInfo() {
        this.setState({
            redux: UserStore(this.state.redux, {
                type: Types.DELETE_TOKENINFO
            })
        });
    }

    getUserCloudAccounts() {
        return Getter.getUserCloudAccounts(this.state.redux);
    }

    getUserInfo(user) {
        return Getter.getUserInfo(this.state.redux, user);
    }

    getTokenInfo() {
        return Getter.getTokenInfo(this.state.redux);
    }

    // QUICKFIX #133
    isWhitelisted() {
        return Getter.isWhitelisted(this.state.redux);
    }

    _empty() {
        this.state = {
            redux: UserStore()
        };
    }
}

export default UserStoreWrapper;
