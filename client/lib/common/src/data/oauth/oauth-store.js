import {Store} from 'flummox';
import _m from 'mori';
import {Pending, Failed} from 'common/src/fetch-result';

class OAuthStore extends Store {
    constructor(flux) {
        super();

        const oauthActions = flux.getActions('oauth');

        this.state = {
            applications: _m.hashMap()
        };

        this.registerAsync(
            oauthActions.fetchOAuthConfig,
            this.beginFetchOAuthConfig,
            this.receiveOAuthConfig,
            this.failFetchOAuthConfig);
    }

    beginFetchOAuthConfig(appId) {
        this.setState({
            applications: _m.assoc(this.state.applications, appId, new Pending())
        });
    }

    failFetchOAuthConfig(err) {
        if (err.status === 404) {
            this.setState({
                applications: _m.assoc(this.state.applications, err.id, _m.toClj({
                                    scopes: [],
                                    s3_buckets: [],
                                    is_client_confidential: false,
                                    redirect_url: ''
                                }))
            });
            return;
        }
        this.setState({
            applications: _m.assoc(this.state.applications, err.id, new Failed(err))
        });
    }

    receiveOAuthConfig([applicationId, config]) {
        this.setState({
            applications: _m.assoc(this.state.applications, applicationId, config)
        });
    }

    /**
     * Returns OAuth configuration for application with `id`. Empty config otherwise.
     *
     * @param  {String} applicationId ID of the application
     * @return {Object|false} Empty configuration if unavailable.
     */
    getOAuthConfig(applicationId) {
        let config = _m.get(this.state.applications, applicationId);
        return config ? _m.toJs(config) : false;
    }

    /**
     * Only for testing!
     */
    _empty() {
        this.setState({
            applications: _m.hashMap()
        });
    }
}

export default OAuthStore;
