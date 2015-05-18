import {Store} from 'flummox';
import _m from 'mori';

class TokeninfoStore extends Store {
    constructor(flux) {
        super();

        const tokeninfoActions = flux.getActions('tokeninfo');

        this.state = {
            tokens: _m.hashMap()
        };

        this.register(
            tokeninfoActions.deleteTokenInfo,
            this.deleteTokenInfo);

        this.registerAsync(
            tokeninfoActions.fetchTokenInfo,
            null,
            this.receiveTokenInfo,
            null);
    }

    receiveTokenInfo([token, tokeninfo]) {
        this.setState({
            tokens: _m.assoc(this.state.tokens, token, _m.toClj(tokeninfo))
        });
    }

    getTokenInfo(token) {
        return _m.toJs(_m.get(this.state.tokens, token, false));
    }

    deleteTokenInfo(token) {
        this.setState({
            tokens: _m.dissoc(this.state.tokens, token)
        });
    }

    _empty() {
        this.setState({
            tokens: _m.hashMap()
        });
    }
}

export default TokeninfoStore;