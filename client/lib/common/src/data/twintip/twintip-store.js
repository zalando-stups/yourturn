import Immutable from 'immutable';
import * as Types from './twintip-types';
import * as Getter from './twintip-getter';
import {Pending, Failed} from 'common/src/fetch-result';

function TwintipStore(state = Immutable.Map(), action) {
    if (!action) {
        return state;
    }
    let {type, payload} = action;
    if (type === Types.RECEIVE_API) {
        return state.set(payload.application_id, Immutable.fromJS(payload));
    } else if (type === Types.BEGIN_FETCH_API) {
        return state.set(payload, new Pending());
    } else if (type === Types.FAIL_FETCH_API) {
        return state.set(payload.id, new Failed(payload));
    }
    return state;
}

export {
    TwintipStore as TwintipStore
};

class TwintipStoreWrapper extends Store {
    constructor(flux) {
        super();

        const twintipActions = flux.getActions('twintip');

        this._empty();

        this.registerAsync(
            twintipActions.fetchApi,
            this.beginFetchApi,
            this.receiveApi,
            this.failFetchApi);
    }

    /**
     * Replaces API with `id` with a Pending state.
     *
     * @param  {String} id
     */
    beginFetchApi(id) {
        this.setState({
            redux: TwintipStore(this.state.redux, {
                type: Types.BEGIN_FETCH_API,
                payload: id
            })
        });
    }

    /**
     * Replaces API with Failed state.
     *
     * @param  {error} err The error passed from the flux action.
     */
    failFetchApi(err) {
        this.setState({
            redux: TwintipStore(this.state.redux, {
                type: Types.FAIL_FETCH_API,
                payload: err
            })
        });
    }

    /**
     * Adds single API to store.
     *
     * @param  {object} api
     */
    receiveApi(api) {
        this.setState({
            redux: TwintipStore(this.state.redux, {
                type: Types.RECEIVE_API,
                payload: api
            })
        });
    }

    getApi(id) {
        return Getter.getApi(this.state.redux, id);
    }

    _empty() {
        this.state = {
            redux: TwintipStore()
        };
    }
}

export default TwintipStoreWrapper;
