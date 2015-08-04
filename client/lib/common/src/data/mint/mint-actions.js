import {Actions} from 'flummox';
import request from 'common/src/superagent';
import {Services} from 'common/src/data/services';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

class MintActions extends Actions {
    fetchOAuthConfig(applicationId) {
        return request
                    .get(`${Services.mint.url}${Services.mint.root}/${applicationId}`)
                    .accept('json')
                    .set('Accept-Encoding', 'gzip')
                    .oauth(Provider, RequestConfig)
                    .exec(saveRoute)
                    .then(res => [applicationId, res.body])
                    .catch(err => {
                        if (err.status === 404) {
                            let body = {
                                scopes: [],
                                s3_buckets: [],
                                is_client_confidential: true,
                                redirect_url: ''
                            };
                            return [applicationId, body];
                        }
                        err.id = applicationId;
                        throw err;
                    });
    }

    saveOAuthConfig(applicationId, config) {
        let configToSend = {
            scopes: config.scopes && config.scopes.length ? config.scopes : undefined,
            s3_buckets: config.s3_buckets && config.s3_buckets.length ? config.s3_buckets : undefined,
            is_client_confidential: config.is_client_confidential,
            redirect_url: config.redirect_url
        };
        return request
                    .put(`${Services.mint.url}${Services.mint.root}/${applicationId}`)
                    .accept('json')
                    .set('Accept-Encoding', 'gzip')
                    .type('json')
                    .send(configToSend)
                    .oauth(Provider, RequestConfig)
                    .exec(saveRoute)
                    .catch(e => {
                        e.id = applicationId;
                        throw e;
                    });
    }
}

export default MintActions;
