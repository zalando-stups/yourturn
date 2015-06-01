import {Flummox} from 'flummox';

import ApplicationActions from 'common/src/data/application/application-actions';
import ApplicationStore from 'common/src/data/application/application-store';

import TwintipActions from 'common/src/data/twintip/twintip-actions';
import TwintipStore from 'common/src/data/twintip/twintip-store';

import ResourceActions from 'common/src/data/resource/resource-actions';
import ResourceStore from 'common/src/data/resource/resource-store';

import OAuthActions from 'common/src/data/oauth/oauth-actions';
import OAuthStore from 'common/src/data/oauth/oauth-store';

import PieroneActions from 'common/src/data/pierone/pierone-actions';
import PieroneStore from 'common/src/data/pierone/pierone-store';

class AppFlux extends Flummox {
    constructor() {
        super();

        this.createActions('application', ApplicationActions);
        this.createStore('application', ApplicationStore, this);

        this.createActions('twintip', TwintipActions);
        this.createStore('twintip', TwintipStore, this);

        this.createActions('resource', ResourceActions);
        this.createStore('resource', ResourceStore, this);

        this.createActions('oauth', OAuthActions);
        this.createStore('oauth', OAuthStore, this);

        this.createActions('pierone', PieroneActions);
        this.createStore('pierone', PieroneStore, this);
    }
}

export default AppFlux;
