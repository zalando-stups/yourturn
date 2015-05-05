import {Flummox} from 'flummox';

import ApplicationActions from 'common/src/data/application/application-actions';
import ApplicationStore from 'common/src/data/application/application-store';

import ApiActions from 'common/src/data/api/api-actions';
import ApiStore from 'common/src/data/api/api-store';

import ResourceActions from 'common/src/data/resource/resource-actions';
import ResourceStore from 'common/src/data/resource/resource-store';

import OAuthActions from 'common/src/data/oauth/oauth-actions';
import OAuthStore from 'common/src/data/oauth/oauth-store';

class AppFlux extends Flummox {
    constructor() {
        super();

        this.createActions( 'application', ApplicationActions );
        this.createStore( 'application', ApplicationStore, this );

        this.createActions( 'api', ApiActions );
        this.createStore( 'api', ApiStore, this );

        this.createActions( 'resource', ResourceActions );
        this.createStore( 'resource', ResourceStore, this );

        this.createActions( 'oauth', OAuthActions );
        this.createStore( 'oauth', OAuthStore, this );
    }
}

export default new AppFlux();