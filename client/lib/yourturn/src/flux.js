import {Flummox} from 'flummox';

import EssentialsActions from 'common/src/data/essentials/essentials-actions';
import EssentialsStore from 'common/src/data/essentials/essentials-store';

import FullstopActions from 'common/src/data/fullstop/fullstop-actions';
import FullstopStore from 'common/src/data/fullstop/fullstop-store';

import KioActions from 'common/src/data/kio/kio-actions';
import KioStore from 'common/src/data/kio/kio-store';

import MintActions from 'common/src/data/mint/mint-actions';
import MintStore from 'common/src/data/mint/mint-store';

import PieroneActions from 'common/src/data/pierone/pierone-actions';
import PieroneStore from 'common/src/data/pierone/pierone-store';

import SearchActions from 'common/src/data/search/search-actions';
import SearchStore from 'common/src/data/search/search-store';

import TeamActions from 'common/src/data/team/team-actions';
import TeamStore from 'common/src/data/team/team-store';

import TwintipActions from 'common/src/data/twintip/twintip-actions';
import TwintipStore from 'common/src/data/twintip/twintip-store';

import UserActions from 'common/src/data/user/user-actions';
import UserStore from 'common/src/data/user/user-store';

class YourturnFlux extends Flummox {
    constructor() {
        super();

        this.createActions('essentials', EssentialsActions);
        this.createStore('essentials', EssentialsStore, this);

        this.createActions('fullstop', FullstopActions);
        this.createStore('fullstop', FullstopStore, this);

        this.createActions('kio', KioActions);
        this.createStore('kio', KioStore, this);

        this.createActions('mint', MintActions);
        this.createStore('mint', MintStore, this);

        this.createActions('pierone', PieroneActions);
        this.createStore('pierone', PieroneStore, this);

        this.createActions('search', SearchActions);
        this.createStore('search', SearchStore, this);

        this.createActions('team', TeamActions);
        this.createStore('team', TeamStore, this);

        this.createActions('twintip', TwintipActions);
        this.createStore('twintip', TwintipStore, this);

        this.createActions('user', UserActions);
        this.createStore('user', UserStore, this);
    }
}

export default new YourturnFlux();