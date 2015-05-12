import {Store} from 'flummox';
import _m from 'mori';
import {Pending, Failed} from 'common/src/fetch-result';

class ApiStore extends Store {
    constructor(flux) {
        super();

        const apiActions = flux.getActions('api');

        this.state = {
            apis: _m.hashMap()
        };

        this.registerAsync(
            apiActions.fetchApi,
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
            apis: _m.assoc(this.state.apis, id, new Pending())
        });
    }

    /**
     * Replaces API with Failed state.
     *
     * @param  {error} err The error passed from the flux action.
     */
    failFetchApi(err) {
        this.setState({
            apis: _m.assoc(this.state.apis, err.id, new Failed(err))
        });
    }

    /**
     * Adds single API to store.
     *
     * @param  {object} api
     */
    receiveApi(api) {
        this.setState({
            apis: _m.assoc(this.state.apis, api.application_id, api)
        });
    }

    /**
     * Returns the API for application with `id`. Does not care about its state, e.g. whether or not
     * it's Pending or Failed.
     *
     * @param  {String} id
     * @return {object} The API with this id
     */
    getApi(id) {
        let api = _m.get(this.state.apis, id);
        return _m.toJs(api);
    }

    _empty() {
        this.setState({
            apis: _m.hashMap()
        });
    }
}

export default ApiStore;