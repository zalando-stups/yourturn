import {Actions} from 'flummox';
import request from 'common/src/superagent';
import {Services} from 'common/src/data/services';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

class OAuthActions extends Actions {
    fetchOAuthConfig(applicationId) {
        return request
                    .get(`${Services.mint.url}${Services.mint.root}/${applicationId}`)
                    .accept('json')
                    .oauth(Provider, RequestConfig)
                    .exec(saveRoute)
                    .then(res => [applicationId, res.body])
                    .catch(e => {
                        e.id = applicationId;
                        throw e;
                    });
    }

    saveOAuthConfig(applicationId, config) {
        config.scopes = config.scopes.length ? config.scopes : undefined;
        config.s3_buckets = config.s3_buckets.length ? config.s3_buckets : undefined;
        return request
                    .put(`${Services.mint.url}${Services.mint.root}/${applicationId}`)
                    .accept('json')
                    .type('json')
                    .send(config)
                    .oauth(Provider, RequestConfig)
                    .exec(saveRoute)
                    .catch(e => {
                        e.id = applicationId;
                        throw e;
                    });
    }
}

export default OAuthActions;
