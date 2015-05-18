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

const YT_FLUX = new Flux();

let sidebar = new Sidebar({
    flux: YT_FLUX
});
sidebar.render();

let notifications = new NotificationBar({
    flux: YT_FLUX
});
notifications.render();


$(document).ready(() => {
    YT_FLUX
        .getActions('user')
        .fetchTokenInfo()
        .then(info => {
            YT_FLUX
                .getActions('user')
                .fetchUserTeams(info.uid);
        });
    $('#yourturn-sidebar').append(sidebar.$el);
    $('body').prepend(notifications.$el);
    new Router({
        flux: YT_FLUX
    });
    new ResourceRouter({
        globalFlux: YT_FLUX
    });
    new AppRouter({
        globalFlux: YT_FLUX
    });
    history.start({
        pushState: true
    });
});

/**
 * Continually dismiss old notifications.
 */
setInterval(() => {
    YT_FLUX
    .getActions('notification')
    .removeNotificationsOlderThan(5000);
}, 5000);


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