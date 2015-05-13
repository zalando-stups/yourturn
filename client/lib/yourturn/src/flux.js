import {Flummox} from 'flummox';

import SearchActions from 'common/src/data/search/search-actions';
import SearchStore from 'common/src/data/search/search-store';

import NotificationActions from 'common/src/data/notification/notification-actions';
import NotificationStore from 'common/src/data/notification/notification-store';

import TeamActions from 'common/src/data/team/team-actions';
import TeamStore from 'common/src/data/team/team-store';

import TokeninfoActions from 'common/src/data/tokeninfo/tokeninfo-actions';
import TokeninfoStore from 'common/src/data/tokeninfo/tokeninfo-store';

class YourturnFlux extends Flummox {
    constructor() {
        super();

        this.createActions('search', SearchActions);
        this.createStore('search', SearchStore, this);

        this.createActions('notification', NotificationActions);
        this.createStore('notification', NotificationStore, this);

        this.createActions('team', TeamActions);
        this.createStore('team', TeamStore, this);

        this.createActions('tokeninfo', TokeninfoActions);
        this.createStore('tokeninfo', TokeninfoStore, this);
    }
}

export default YourturnFlux;