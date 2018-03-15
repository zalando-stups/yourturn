import request from 'common/src/superagent';
import {Services} from 'common/src/data/services';
import {createAction} from 'redux-actions';
import Type from './mint-types';
import {flummoxCompatWrap} from 'common/src/redux-middlewares';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';

function fetchOAuthConfig(applicationId) {
    return request
            .get(`${Services.mint.url}${Services.mint.root}/${applicationId}`)
            .accept('json')
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

function saveOAuthConfig(applicationId, config) {
    let configToSend = {
        scopes: config.scopes && config.scopes.length ? config.scopes : undefined,
        kubernetes_clusters: config.kubernetes_clusters && config.kubernetes_clusters.length ? config.kubernetes_clusters : undefined,
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
            .catch(e => {
                e.id = applicationId;
                throw e;
            });
}

function renewCredentials(applicationId) {
    return request
            .post(`${Services.mint.url}${Services.mint.root}/${applicationId}/renewal`)
            .oauth(Provider, RequestConfig)
            .exec(saveRoute)
            .catch(err => {
                err.id = applicationId;
                throw err;
            });
}

let fetchAction = flummoxCompatWrap(createAction(Type.FETCH_OAUTH_CONFIG, fetchOAuthConfig)),
    saveAction = flummoxCompatWrap(createAction(Type.SAVE_OAUTH_CONFIG, saveOAuthConfig)),
    renewAction = flummoxCompatWrap(createAction(Type.RENEW_CREDENTIALS, renewCredentials));

export {
    renewAction as renewCredentials,
    saveAction as saveOAuthConfig,
    fetchAction as fetchOAuthConfig
};
