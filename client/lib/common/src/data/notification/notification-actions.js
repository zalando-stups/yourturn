// import {createAction} from 'redux-actions';
// import * as Type from './notification-types';
import {Actions} from 'flummox';

function addNotification(message, type) {
    return [message, type];
}

function removeNotification(id) {
    return id;
}

function removeNotificationsOlderThan(ms) {
    return ms;
}


class NotificationActions extends Actions {

    addNotification(message, type) {
        return addNotification(message, type || 'default');
    }

    removeNotification(id) {
        return removeNotification(id);
    }

    removeNotificationsOlderThan(ms) {
        return removeNotificationsOlderThan(ms);
    }
}

export default NotificationActions;

// let addNotification = createAction(Type.ADD),
//     removeNotification = createAction(Type.REMOVE),
//     removeNotificationsOlderThan = createAction(Type.REMOVE_OLD);

export {
    addNotification as addNotification,
    removeNotification as removeNotification,
    removeNotificationsOlderThan as removeNotificationsOlderThan
};