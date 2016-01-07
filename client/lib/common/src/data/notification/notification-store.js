/** global Date */
import uniq from 'uniqueid';
import Types from './notification-types';

function NotificationStore(notifications = [], action) {
    if (!action) {
        return notifications;
    }

    if (action.type === Types.ADD_NOTIFICATION) {
        // add
        let [message, type] = action.payload;
        notifications = notifications.concat([{
                    type: type || 'default',
                    message: message,
                    id: uniq(),
                    created: Date.now()
                }]);
    } else if (action.type === Types.REMOVE_NOTIFICATION) {
        // remove
        let id = action.payload;
        notifications = notifications.filter(n => n.id !== id);
    } else if (action.type === Types.REMOVE_NOTIFICATIONS_OLDER_THAN) {
        // remove old
        let now = Date.now(),
            ms = action.payload;
        notifications = notifications.filter(n => n.created > (now - ms));
    }
    return notifications;
}

export default NotificationStore;
