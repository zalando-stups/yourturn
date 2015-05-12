import {Flummox} from 'flummox';

import SearchActions from 'common/src/data/search/search-actions';
import SearchStore from 'common/src/data/search/search-store';

import NotificationActions from 'common/src/data/notification/notification-actions';
import NotificationStore from 'common/src/data/notification/notification-store';

class YourturnFlux extends Flummox {
    constructor() {
        super();

        this.createActions('search', SearchActions);
        this.createStore('search', SearchStore, this);

        this.createActions('notification', NotificationActions);
        this.createStore('notification', NotificationStore, this);
    }
}

export default YourturnFlux;