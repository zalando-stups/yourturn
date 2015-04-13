import uuid from 'node-uuid';
import querystring from 'querystring';
let {localStorage} = window;

function assertPresent(obj, ...fields) {
    if (obj === undefined) {
        throw new Error();  //TODO message
    }
    let undef = fields.filter( f => obj[f] === undefined );
    if (undef.length) {
        throw new Error(`${undef[0]} is not present on {obj}.`);
    }
}


class OAuthTokenStorage {
    constructor() {}

    get(key) {}
    set(key, val) {}
    remove(key) {}
    _empty() {}
}

class LocalTokenStorage extends OAuthTokenStorage {
    constructor(prefix) {
        super();
        assertPresent(prefix);
        this.prefix = prefix;
    }

    get(key) {
        return localStorage.getItem(`${this.prefix}-${key}`);
    }

    set(key, val) {
        return localStorage.setItem(`${this.prefix}-${key}`, val);
    }

    remove(key) {
        return localStorage.removeItem(`${this.prefix}-${key}`);
    }

    _empty() {
        localStorage.clear();
    }
}


// - id: (kio)
// - host: kio.stups.zalan.do
class OAuthProvider {
    constructor(config) {
        this.config = config;
        assertPresent(config, 'authorization_url', 'id');
        this.id = config.id;
        this.hosts = config.hosts;
        this.authorization_url = config.authorization_url;
        this.store = config.store || new LocalTokenStorage(this.id);

        if (this.authorization_url.endsWith('/') &&
            !this.authorization_url.includes('?')) {
            this.authorization_url += this.authorization_url.substring(0, this.authorization_url.length - 1);
        }
    }

    remember(request) {
        if (request.state){
            return this.store.set(request.state, JSON.stringify(request));
        }
        return false;
    }

    forget(request) {
        return this.store.remove(request.state);
    }

    isExpected(response) {
        if (response.state) {
            return this.store.get(response.state) !== null;
        }
        return false;
    }

    hasAccessToken() {
        return this.store.get('access_token') !== null;
    }

    getAccessToken() {
        return this.store.get('access_token');
    }

    setAccessToken(token) {
        return this.store.set('access_token', token);
    }

    hasRefreshToken() {
        return this.store.get('refresh_token') !== null;
    }

    getRefreshToken() {
        return this.store.get('refresh_token');
    }

    setRefreshToken(token) {
        return this.store.set('refresh_token', token);
    }

    encodeInUri(request) {
        if (request instanceof OAuthImplicitRequest) {
            return this.authorization_url + '?' + querystring.stringify(request);
        }
    }

    decodeFromUri(fragment) {
        let parsed = querystring.parse(fragment);
        return parsed.error ? new OAuthErrorResponse(parsed) : new OAuthImplicitResponse(parsed);
    }

    parse(fragment) {
        if (!fragment) {
            throw new Error('No URL fragement provided.');
        }
        if (typeof fragment !== 'string') {
            throw new Error('URL fragment is not a string.');
        }
        let hash = fragment.startsWith('#') ? fragment.substring(1) : fragment;
        let response = this.decodeFromUri(hash);
        if (!this.isExpected(response)) {
            throw new Error('Unexpected OAuth response', response);
        }
        // forget request. seems safe, dunno if replay attacks are possible here in principle
        let request = JSON.parse(this.store.get(response.state));
        this.forget(request);
        response.metadata = request.metadata;
        if (response instanceof OAuthErrorResponse) {            
            return response;
        }
        // if we expected this response
        if (response instanceof OAuthImplicitResponse) {
            // update the tokens
            this.setAccessToken(response.access_token);
            this.setRefreshToken(response.refresh_token);
            // return the request so that we know 
            return response;
        }
        throw new Error('Expected OAuth2 response is neither error nor success. This should not happen.');
    }
}

/**
 * As per RFC 6749, Section 4.2.1
 * ----
 * - response_type: REQUIRED, MUST be "token"
 * - client_id: REQUIRED
 * - redirect_uri: OPTIONAL
 * - scope: OPTIONAL
 * - state: RECOMMENDED 
 */
class OAuthRequest {
    constructor(config) {
        assertPresent(config, 'response_type');

        this.config = config;
        this.response_type = config.response_type;
        this.scope = config.scope;
    }
}

class OAuthImplicitRequest extends OAuthRequest {
    constructor(config) {
        config.response_type = 'token';
        super(config);
        assertPresent(config, 'client_id');
        this.client_id = config.client_id;
        this.redirect_uri = config.redirect_uri;
        this.state = uuid.v4();
    }
}

/**
 * As per RFC 6749
 * ---
 * - access_token: REQUIRED
 * - token_type: REQUIRED
 * - expires_in: RECOMMENDED
 * - scope: OPTIONAL
 * - refresh_token: OPTIONAL
 */
class OAuthResponse {
    constructor(response) {
        this.response = response;
        assertPresent(response, 'access_token', 'token_type');

        this.access_token = response.access_token;
        this.token_type = response.token_type;
        this.refresh_token = response.refresh_token || null;
        this.expires_in = response.expires_in ? parseInt(response.expires_in) : null;
        this.scope = response.scope;
    }
}

class OAuthImplicitResponse extends OAuthResponse {
    constructor(response) {
        super(response);
        assertPresent(response, 'state');
        this.state = response.state;
    }
}

class OAuthErrorResponse {
    constructor(response) {
        assertPresent(response, 'error', 'state');
        //TODO maybe check valid errors
        this.error = response.error;
        this.state = response.state;
    }

    getMessage() {
        //TODO RFC 6749 Section 4.2.2.1
        return 'Some error';
    }
}

export {
    OAuthRequest as Request,
    OAuthImplicitRequest as ImplicitRequest,
    OAuthProvider as Provider,
    OAuthResponse as Response,
    OAuthImplicitResponse as ImplicitResponse,
    OAuthErrorResponse as ErrorResponse,
    LocalTokenStorage as LocalTokenStorage
};