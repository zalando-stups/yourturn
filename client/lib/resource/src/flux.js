import {Flummox} from 'flummox';

import EssentialsActions from 'common/src/data/essentials/essentials-actions';
import EssentialsStore from 'common/src/data/essentials/essentials-store';

class ResourceFlux extends Flummox {
    constructor() {
        super();

        this.createActions('essentials', EssentialsActions);
        this.createStore('essentials', EssentialsStore, this);
    }
}

export default ResourceFlux;