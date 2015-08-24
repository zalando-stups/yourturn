import {Store} from 'flummox';
import Immutable from 'immutable';
import {Pending, Failed} from 'common/src/fetch-result';

class TwintipStore extends Store {
    constructor(flux) {
        super();

        const twintipActions = flux.getActions('twintip');

        this.state = {
            apis: Immutable.Map()
        };

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
            apis: this.state.apis.set(id, new Pending())
        });
    }

    /**
     * Replaces API with Failed state.
     *
     * @param  {error} err The error passed from the flux action.
     */
    failFetchApi(err) {
        this.setState({
            apis: this.state.apis.set(err.id, new Failed(err))
        });
    }

    /**
     * Adds single API to store.
     *
     * @param  {object} api
     */
    receiveApi(api) {
        this.setState({
            apis: this.state.apis.set(api.application_id, Immutable.fromJS(api))
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
        let api = this.state.apis.get(id);
        return api ? api.toJS() : false;
    }

    _empty() {
        this.setState({
            apis: Immutable.Map()
        });
    }
}

export default TwintipStore;
