import {Flummox} from 'flummox';

import ApplicationActions from 'common/src/data/application/application-actions';
import ApplicationStore from 'common/src/data/application/application-store';

import ApiActions from 'common/src/data/api/api-actions';
import ApiStore from 'common/src/data/api/api-store';

import ResourceActions from 'common/src/data/resource/resource-actions';
import ResourceStore from 'common/src/data/resource/resource-store';

class AppFlux extends Flummox {
    constructor() {
        super();

        this.createActions( 'application', ApplicationActions );
        this.createStore( 'application', ApplicationStore, this );

        this.createActions( 'api', ApiActions );
        this.createStore( 'api', ApiStore, this );

        this.createActions( 'resource', ResourceActions );
        this.createStore( 'resource', ResourceStore, this );
    }
}

export default new AppFlux();