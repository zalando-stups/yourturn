/** global window */
import OAUTH_CLIENT_ID from 'OAUTH_CLIENT_ID';
import OAUTH_AUTH_URL from 'OAUTH_AUTH_URL';
import OAUTH_REDIRECT_URI from 'OAUTH_REDIRECT_URI';
import OAUTH_SCOPES from 'OAUTH_SCOPES';
import {Provider} from '@zalando/oauth2-client-js';

let provider = new Provider({
    id: 'stups',
    authorization_url: OAUTH_AUTH_URL
});

const requestConfig = {
    client_id: OAUTH_CLIENT_ID,
    scope: OAUTH_SCOPES,
    redirect_uri: OAUTH_REDIRECT_URI
};

function saveRoute(req) {
    req.metadata.route = window.location.pathname + window.location.search;
}

export {
    provider as Provider,
    requestConfig as RequestConfig,
    saveRoute as saveRoute
};
