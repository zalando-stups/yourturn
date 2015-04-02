import {Flummox} from 'flummox';

import ApplicationActions from './data/application-actions';
import ApplicationStore from './data/application-store';

import ApiActions from './data/api-actions';
import ApiStore from './data/api-store';

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