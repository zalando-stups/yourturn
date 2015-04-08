import uuid from 'node-uuid';
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
    }

    hasToken() {
        return this.store.get('token') !== null;
    }

    getToken() {
        return this.store.get('token');
    }

    setToken(token) {
        return this.store.set('token', token);
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
        assertPresent(config, 'client_id');

        this.config = config;

        this.response_type = 'token';
        this.client_id = config.client_id;
        this.redirect_uri = config.redirect_uri;
        this.scope = config.scope;
        this.state = uuid.v4();
    }
}

class OAuthRequestFactory {
    constructor(config) {
        this.config = config;
    }

    new(overrides) {
        let config = _.merge(overrides || {}, this.config);
        return new OAuthRequest(config);
    }
}

/**
 * As per RFC 6749, Section 4.2.2
 * ---
 * - access_token: REQUIRED
 * - token_type: REQUIRED
 * - expires_in: RECOMMENDED
 * - scope: OPTIONAL
 * - state: REQUIRED if it was present before (it was)
 */
class OAuthResponse {
    constructor(response) {
        this.response = response;
        assertPresent(response, 'access_token', 'token_type', 'state');

        this.access_token = response.access_token;
        this.token_type = response.token_type;
        this.state = response.state;
        this.expires_in = response.expires_in || false;
        this.scope = response.scope;
    }
}

export {
    OAuthRequest as Request,
    OAuthRequestFactory as RequestFactory,
    OAuthProvider as Provider,
    OAuthResponse as Response,
    LocalTokenStorage as LocalTokenStorage
};