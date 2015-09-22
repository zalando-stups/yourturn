/** global Date */
import uniq from 'uniqueid';
import * as Type from './notification-types';
import {Store} from 'flummox';

function NotificationStore(notifications = [], action) {
    if (!action) {
        return notifications;
    }

    if (action.type === Type.ADD_NOTIFICATION) {
        // add
        let [message, type] = action.payload;
        notifications = notifications.concat([{
                    type: type || 'default',
                    message: message,
                    id: uniq(),
                    created: Date.now()
                }]);
    } else if (action.type === Type.REMOVE_NOTIFICATION) {
        // remove
        let id = action.payload;
        notifications = notifications.filter(n => n.id !== id);
    } else if (action.type === Type.REMOVE_NOTIFICATIONS_OLDER_THAN) {
        // remove old
        let now = Date.now(),
            ms = action.payload;
        notifications = notifications.filter(n => n.created > (now - ms));
    }
    return notifications;
}

export {
    NotificationStore as NotificationStore
};

export default class NotificationStoreWrapper extends Store {
    constructor(flux) {
        super();

        const notificationActions = flux.getActions('notification');

        this._empty();

        this.register(notificationActions.addNotification, this.receiveNotification);
        this.register(notificationActions.removeNotification, this.deleteNotification);
        this.register(notificationActions.removeNotificationsOlderThan, this.deleteOldNotifications);
    }

    /**
     * Saves notification.
     */
    receiveNotification([message, type]) {
        this.setState({
            redux: NotificationStore(this.state.redux, {
                type: Type.ADD_NOTIFICATION,
                payload: [message, type]
            })
        });
    }

    /**
     * Removes notification with `id`.
     *
     * @param  {number} id The ID of the notification
     */
    deleteNotification(id) {
        this.setState({
            redux: NotificationStore(this.state.redux, {
                type: Type.REMOVE_NOTIFICATION,
                payload: id
            })
        });
    }

    /**
     * Removes notifications older than `ms` ms.
     *
     * @param  {number} ms The age of the notification in ms.
     */
    deleteOldNotifications(ms) {
        this.setState({
            redux: NotificationStore(this.state.redux, {
                type: Type.REMOVE_NOTIFICATIONS_OLDER_THAN,
                payload: ms
            })
        });
    }

    /**
     * Returns all notifications.
     */
    getNotifications() {
        return this.state.redux;
    }

    _empty() {
        this.setState({
            redux: NotificationStore()
        });
    }
}