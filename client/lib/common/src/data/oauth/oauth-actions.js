import {Actions} from 'flummox';
import request from 'common/src/superagent';
import {Services} from 'common/src/data/services';
// import {Provider, RequestConfig} from 'common/src/oauth-provider';

class OAuthActions extends Actions {
    fetchOAuthConfig(applicationId) {
        return request
                    .get(`${Services.mint.url}${Services.mint.root}/${applicationId}`)
                    .accept('json')
                    .exec()
                    .then(res => res.body)
                    .catch(e => {
                        e.id = applicationId;
                        throw e;
                    });
    }
}

export default OAuthActions;
