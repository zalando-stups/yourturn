import {Flummox} from 'flummox';

import ApplicationActions from 'common/src/data/application/application-actions';
import ApplicationStore from 'common/src/data/application/application-store';

import ApiActions from 'common/src/data/api/api-actions';
import ApiStore from 'common/src/data/api/api-store';

class AppFlux extends Flummox {
    constructor() {
        super();

        this.createActions( 'application', ApplicationActions );
        this.createStore( 'application', ApplicationStore, this );

        this.createActions( 'api', ApiActions );
        this.createStore( 'api', ApiStore, this );
    }
}

export default new AppFlux();