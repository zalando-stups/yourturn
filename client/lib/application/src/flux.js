import {Flummox} from 'flummox';

import ApplicationActions from './data/application-actions';
import ApplicationStore from './data/application-store';

class AppFlux extends Flummox {
    constructor() {
        super();

        this.createActions( 'application', ApplicationActions );
        this.createStore( 'application', ApplicationStore, this );
    }
}

export default new AppFlux();