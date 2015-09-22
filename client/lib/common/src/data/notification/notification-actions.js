// import {createAction} from 'redux-actions';
// import * as Type from './notification-types';
import {Actions} from 'flummox';

function _addNotification(message, type) {
    return [message, type];
}

function _removeNotification(id) {
    return id;
}

function _removeNotificationsOlderThan(ms) {
    return ms;
}


class NotificationActions extends Actions {

    addNotification(message, type) {
        return _addNotification(message, type);
    }

    removeNotification(id) {
        return _removeNotification(id);
    }

    removeNotificationsOlderThan(ms) {
        return _removeNotificationsOlderThan(ms);
    }
}

export default NotificationActions;

// let addNotification = createAction(Type.ADD),
//     removeNotification = createAction(Type.REMOVE),
//     removeNotificationsOlderThan = createAction(Type.REMOVE_OLD);

// export {
//     addNotification as addNotification,
//     removeNotification as removeNotification,
//     removeNotificationsOlderThan as removeNotificationsOlderThan
// };