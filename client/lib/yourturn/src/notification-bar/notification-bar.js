import $ from 'jquery';
import BaseView from 'common/src/base-view';
import Template from './notification-bar.hbs';
import Flux from '../flux';
import 'common/asset/scss/yourturn/notification-bar.scss';

class NotificationBar extends BaseView {
    constructor() {
        this.store = Flux.getStore('notification');
        this.actions = Flux.getActions('notification');
        this.className = 'notificationBar';
        this.events = {
            'click li': 'dismissNotification'
        };
        super();
    }

    /**
     * Removes the clicked notification from the store.
     */
    dismissNotification(evt) {
        let id = parseInt($(evt.target).attr('data-notification-id'), 10);
        this.actions.removeNotification(id);
    }

    update() {
        this.data = {
            notifications: this.store.getNotifications()
        };
    }

    render() {
        this.$el.html(Template(this.data));
        return this;
    }
}

export default NotificationBar;