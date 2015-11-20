import {Actions} from 'flummox';
import request from 'common/src/superagent';
import {Services} from 'common/src/data/services';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

function fetchOAuthConfig(applicationId) {
    return request
            .get(`${Services.mint.url}${Services.mint.root}/${applicationId}`)
            .accept('json')
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .then(res => [applicationId, res.body])
            .catch (err => {
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

function saveOAuthConfig(applicationId, config) {
    let configToSend = {
        scopes: config.scopes && config.scopes.length ? config.scopes : undefined,
        s3_buckets: config.s3_buckets && config.s3_buckets.length ? config.s3_buckets : undefined,
        is_client_confidential: config.is_client_confidential,
        redirect_url: config.redirect_url
    };
    return request
            .put(`${Services.mint.url}${Services.mint.root}/${applicationId}`)
            .accept('json')
            .type('json')
            .send(configToSend)
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .catch (e => {
                e.id = applicationId;
                throw e;
            });
}

function renewCredentials(applicationId) {
    return request
            .post(`${Services.mint.url}${Services.mint.root}/${applicationId}/renewal`)
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .catch (err => {
                err.id = applicationId;
                throw err;
            });
}

class MintActions extends Actions {
    renewCredentials(applicationId) {
        return renewCredentials(applicationId);
    }

    saveOAuthConfig(applicationId, config) {
        return saveOAuthConfig(applicationId, config);
    }

    fetchOAuthConfig(applicationId) {
        return fetchOAuthConfig(applicationId);
    }
}

export default MintActions;

export {
    renewCredentials,
    saveOAuthConfig,
    fetchOAuthConfig
};
