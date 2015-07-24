import {Flummox} from 'flummox';

import FullstopActions from 'common/src/data/fullstop/fullstop-actions';
import FullstopStore from 'common/src/data/fullstop/fullstop-store';

import TeamActions from 'common/src/data/team/team-actions';
import TeamStore from 'common/src/data/team/team-store';

class ViolationFlux extends Flummox {
    constructor() {
        super();

        this.createActions('fullstop', FullstopActions);
        this.createStore('fullstop', FullstopStore, this);

        this.createActions('team', TeamActions);
        this.createStore('team', TeamStore, this);
    }
}

export default ViolationFlux;
