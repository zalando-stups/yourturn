import {Provider} from 'oauth2-client-js';

let provider = new Provider({
    id: 'aopenamprovider',
    authorization_url: 'http://localhost:5002/auth'
});

const requestConfig = {
    client_id: 'test',
    redirect_uri: 'http://localhost:3000/oauth'
};

export {
    provider as Provider,
    requestConfig as RequestConfig
};