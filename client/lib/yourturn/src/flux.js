import {Flummox} from 'flummox';

import SearchActions from 'common/src/data/search/search-actions';
import SearchStore from 'common/src/data/search/search-store';

class YourturnFlux extends Flummox {
    constructor() {
        super();

        this.createActions( 'search', SearchActions );
        this.createStore( 'search', SearchStore, this );
    }
}

export default new YourturnFlux();