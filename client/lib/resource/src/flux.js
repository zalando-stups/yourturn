import {Flummox} from 'flummox';

import ResourceActions from 'common/src/data/resource/resource-actions';
import ResourceStore from 'common/src/data/resource/resource-store';

class ResourceFlux extends Flummox {
    constructor() {
        super();

        this.createActions('resource', ResourceActions);
        this.createStore('resource', ResourceStore, this);
    }
}

export default ResourceFlux;