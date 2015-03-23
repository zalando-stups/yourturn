import {Flummox} from 'flummox';
import {FLUX_ID} from '../config';
import Actions from './ApplicationActions';
import Store from './ApplicationStore';

class Flux extends Flummox {
    constructor() {
        super();

        this.createActions(FLUX_ID, Actions);
        this.createStore(FLUX_ID, Store, this);
    }
}

export default new Flux();