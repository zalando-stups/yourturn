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
        return notifications.concat([{
                    type: type || 'default',
                    message: message,
                    id: uniq(),
                    created: Date.now()
                }]);
    } else if (action.type === Types.REMOVE_NOTIFICATION) {
        // remove
        let id = action.payload;
        return notifications.filter(n => n.id !== id);
    } else if (action.type === Types.REMOVE_NOTIFICATIONS_OLDER_THAN) {
        // remove old
        const now = Date.now(),
              ms = action.payload,
              containsOld = notifications.some(n => n.created <= (now - ms));
        if (containsOld) {
            return notifications.filter(n => n.created > (now - ms));
        }
    }
    return notifications;
}

export default NotificationStore;
