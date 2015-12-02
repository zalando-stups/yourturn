import {createRedux, applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import {reduxPromiseMiddleware, flummoxCompatMiddleware} from 'common/src/util';
import NotificationStore from 'common/src/data/notification/notification-store';
import {KioStore} from 'common/src/data/kio/kio-store';

const logger = createLogger(),
    STORE = combineReducers({
        notifications: NotificationStore,
        kio: KioStore
    }),
    createWithMiddleware = applyMiddleware(thunk, flummoxCompatMiddleware, reduxPromiseMiddleware, logger)(createStore);

export default createWithMiddleware(STORE);
