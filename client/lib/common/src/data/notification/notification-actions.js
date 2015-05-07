import {Actions} from 'flummox';

class NotificationActions extends Actions {

    addNotification(message, type) {
        return [message, type];
    }

    removeNotification(id) {
        return id;
    }

    removeNotificationsOlderThan(ms) {
        return ms;
    }
}

export default NotificationActions;