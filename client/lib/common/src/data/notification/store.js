/** global Date */
import uniq from 'uniqueid';
import Type from './action-types';

export default function notificationStore(notifications = [], action) {
    if (action.type === Type.ADD) {
        // add
        let [message, type] = action.payload;
        notifications = notifications.concat([{
                    type: type || 'default',
                    message: message,
                    id: uniq(),
                    created: Date.now()
                }]);
    } else if (action.type === Type.REMOVE) {
        // remove
        let id = action.payload;
        notifications = notifications.filter(n => n.id !== id);
    } else if (action.type === Type.REMOVE_OLD) {
        // remove old
        let now = Date.now(),
            ms = action.payload;
        notifications = notifications.filter(n => n.created > (now - ms));
    }
    return notifications;
}