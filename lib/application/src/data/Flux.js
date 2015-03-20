import {Flummox} from 'flummox';

import Actions from './ApplicationActions';
import Store from './ApplicationStore';

export default class Flux extends Flummox {
    constructor() {
        super();

        this.createActions('applications', Actions);
        this.createStore('applications', Store, this);
    }
}