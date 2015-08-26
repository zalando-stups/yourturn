import {createRedux, createDispatcher, composeStores} from 'redux';
import promiseSupport from 'redux-promise';
import NotificationStore from 'common/src/data/notification/store';

const STORES = composeStores({
        notifications: NotificationStore
    }),
    DISPATCHER = createDispatcher(
        STORES,
        [promiseSupport]);

export default createRedux(DISPATCHER);