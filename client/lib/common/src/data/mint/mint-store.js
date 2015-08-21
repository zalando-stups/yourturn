import {Store} from 'flummox';
import Immutable from 'immutable';
import {Pending, Failed} from 'common/src/fetch-result';

class MintStore extends Store {
    constructor(flux) {
        super();

        const mintActions = flux.getActions('mint');

        this.state = {
            applications: Immutable.Map()
        };

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
            applications: this.state.applications.set(appId, new Pending())
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
            applications: this.state.applications.set(err.id, new Failed(err))
        });
    }

    /**
     * Receives an oauth configuration for an application.
     */
    receiveOAuthConfig([applicationId, config]) {
        this.setState({
            applications: this.state.applications.set(applicationId, Immutable.fromJS(config))
        });
    }

    /**
     * Returns OAuth configuration for application with `id`. Empty config otherwise.
     *
     * @param  {String} applicationId ID of the application
     * @return {Object|false} Empty configuration if unavailable.
     */
    getOAuthConfig(applicationId) {
        let config = this.state.applications.get(applicationId);
        return config ? config.toJS() : false;
    }

    /**
     * Only for testing!
     */
    _empty() {
        this.setState({
            applications: Immutable.Map()
        });
    }
}

export default MintStore;
