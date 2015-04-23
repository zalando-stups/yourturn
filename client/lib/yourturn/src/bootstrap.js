import $ from 'jquery';
import {history} from 'backbone';
import Sidebar from './sidebar/sidebar';
import NotificationBar from './notification-bar/notification-bar';
import Router from './router';
import ResourceRouter from 'resource/src/router';
import AppRouter from 'application/src/router';
import Flux from './flux';

import 'common/asset/scss/base.scss';
import 'common/asset/scss/grid.scss';
import 'common/asset/scss/yourturn/yourturn.scss';

let sidebar = new Sidebar();
sidebar.render();

let notifications = new NotificationBar();
notifications.render();

$(document).ready( () => {
    $('#yourturn-sidebar').append(sidebar.$el);
    $('body').prepend(notifications.$el);
    new Router();
    new ResourceRouter();
    new AppRouter();
    history.start({
        pushState: true
    });
});

/**
 * Continually dismiss old notifications.
 */
setInterval(() => {
    Flux
    .getActions('notification')
    .removeNotificationsOlderThan(5000);
}, 5000 );


/**
 * To prevent a full page reload when someone clicks a link, we
 * have to prevent the browser from following the link and trigger
 * the route ourselves.
 *
 * See http://stackoverflow.com/a/7643188
 */
$(document).on('click', 'a:not([data-external])', function (evt) {
    var href = $(this).attr('href');
    evt.preventDefault();
    history.navigate(href, {
        trigger: true
    });
});