/** global Date */
import {Store} from 'flummox';
import Immutable from 'immutable';

var lastId = 0;

class NotificationStore extends Store {
    constructor(flux) {
        super();

        const notificationActions = flux.getActions('notification');

        this.state = {
            notifications: Immutable.List()
        };

        this.register(notificationActions.addNotification, this.receiveNotification);
        this.register(notificationActions.removeNotification, this.deleteNotification);
        this.register(notificationActions.removeNotificationsOlderThan, this.deleteOldNotifications);
    }

    /**
     * Saves notification.
     */
    receiveNotification([message, type]) {
        lastId += 1;
        this.setState({
            notifications: this.state.notifications.push(Immutable.Map({
                type: type || 'default',
                message: message,
                id: lastId,
                created: Date.now()
            }))
        });
    }

    /**
     * Removes notification with `id`.
     *
     * @param  {number} id The ID of the notification
     */
    deleteNotification(id) {
        this.setState({
            notifications: this.state.notifications.filter(n => n.get('id') !== id)
        });
    }

    /**
     * Removes notifications older than `ms` ms.
     *
     * @param  {number} ms The age of the notification in ms.
     */
    deleteOldNotifications(ms) {
        let now = Date.now();
        this.setState({
            notifications: this.state.notifications.filter(n => n.get('created') > (now - ms))
        });
    }

    /**
     * Returns all notifications.
     */
    getNotifications() {
        return this.state.notifications.toJS();
    }

    _empty() {
        this.setState({
            notifications: Immutable.List()
        });
    }
}

export default NotificationStore;
