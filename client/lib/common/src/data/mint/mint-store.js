import {Store} from 'flummox';
import Immutable from 'immutable';
import {Pending, Failed} from 'common/src/fetch-result';
import Types from './mint-types';
import * as Getter from './mint-getter';

function MintStore(state = Immutable.Map(), action) {
    if (!action) {
        return state;
    }

    let {type, payload} = action;

    if (type === Types.BEGIN_FETCH_OAUTH_CONFIG) {
        return state.set(payload, new Pending());
    } else if (type === Types.FAIL_FETCH_OAUTH_CONFIG) {
        return state.set(payload.id, new Failed(payload));
    } else if (type === Types.RECEIVE_OAUTH_CONFIG) {
        let [applicationId, config] = payload;
        return state.set(applicationId, Immutable.fromJS(config));
    }

    return state;
}

export {
    MintStore
};

class MintStoreWrapper extends Store {
    constructor(flux) {
        super();

        const mintActions = flux.getActions('mint');

        this._empty();

        this.registerAsync(
            mintActions.fetchOAuthConfig,
            this.beginFetchOAuthConfig,
            this.receiveOAuthConfig,
            this.failFetchOAuthConfig);
    }

    /**
     * Sets a Pending result for the configuration of this application.
     *
     * @param  {String} appId ID of the application
     */
    beginFetchOAuthConfig(appId) {
        this.setState({
            redux: MintStore(this.state.redux, {
                type: Types.BEGIN_FETCH_OAUTH_CONFIG,
                payload: appId
            })
        });
    }

    /**
     * If it failed with a 404, it saves a default configuration
     * for this application. Otherwise a Failed is saved.
     *
     * @param  {Error} err The error
     */
    failFetchOAuthConfig(err) {
        this.setState({
            redux: MintStore(this.state.redux, {
                type: Types.FAIL_FETCH_OAUTH_CONFIG,
                payload: err
            })
        });
    }

    /**
     * Receives an oauth configuration for an application.
     */
    receiveOAuthConfig([applicationId, config]) {
        this.setState({
            redux: MintStore(this.state.redux, {
                type: Types.RECEIVE_OAUTH_CONFIG,
                payload: [applicationId, config]
            })
        });
    }

    getOAuthConfig(applicationId) {
        return Getter.getOAuthConfig(this.state.redux, applicationId);
    }

    /**
     * Only for testing!
     */
    _empty() {
        this.setState({
            redux: MintStore()
        });
    }
}

export default MintStoreWrapper;
