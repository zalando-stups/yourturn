import {createAction} from 'redux-actions';
import Type from './notification-types';

function addNotification(message, type) {
    return [message, type];
}

function removeNotification(id) {
    return id;
}

function removeNotificationsOlderThan(ms) {
    return ms;
}

let addAction = createAction(Type.ADD_NOTIFICATION, addNotification),
    removeAction = createAction(Type.REMOVE_NOTIFICATION, removeNotification),
    removeOldAction = createAction(Type.REMOVE_NOTIFICATIONS_OLDER_THAN, removeNotificationsOlderThan);

export {
    addAction as addNotification,
    removeAction as removeNotification,
    removeOldAction as removeNotificationsOlderThan
};
