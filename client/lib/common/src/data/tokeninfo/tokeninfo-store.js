import {Store} from 'flummox';
import _m from 'mori';

class TokeninfoStore extends Store {
    constructor(flux) {
        super();

        const tokeninfoActions = flux.getActions('tokeninfo');

        this.state = {
            tokeninfo: _m.hashMap()
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
            tokeninfo: _m.hashMap()
        });
    }
}

export default TokeninfoStore;