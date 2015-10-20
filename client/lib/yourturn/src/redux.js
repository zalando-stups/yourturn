import {createRedux, applyMiddleware, combineReducers, createStore} from 'redux';
import promiseSupport from 'redux-promise';
import {NotificationStore} from 'common/src/data/notification/notification-store';

const STORE = combineReducers({
        notifications: NotificationStore
    }),
    createWithMiddleware = applyMiddleware(promiseSupport)(createStore);

export default createWithMiddleware(STORE);