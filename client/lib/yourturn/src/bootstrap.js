import $ from 'jquery';
import {history} from 'backbone';
import Sidebar from './sidebar/sidebar';
import Router from './router';
import AppRouter from 'application/src/router';

import 'common/asset/scss/grid.scss';
import 'common/asset/scss/yourturn/yourturn.scss';

let sidebar = new Sidebar();
sidebar.render();


$(document).ready( () => {
    $('#yourturn-sidebar').append( sidebar.$el );
    new Router();
    new AppRouter();
    history.start({
        pushState: true
    });
});

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