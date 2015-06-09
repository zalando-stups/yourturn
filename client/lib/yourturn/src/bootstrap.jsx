import React from 'react';
import Router from 'react-router';
import FluxComponent from 'flummox/component';
import ROUTES from './router.react.jsx';
import YT_FLUX from './flux';

import Sidebar from './sidebar/sidebar.jsx';
import NotificationBar from './notification-bar/notification-bar.jsx';

import 'common/asset/less/base.less';
import 'common/asset/less/grid.less';
import 'common/asset/less/yourturn/yourturn.less';

const MAIN_VIEW_ID = 'yourturn-view';

let router = Router.create({
    routes: ROUTES,
    location: Router.HistoryLocation
});

function fetchData(routes, state) {
    let promises = routes
                    .filter(route => route.handler.fetchData !== undefined)
                    .map(route => route.handler.fetchData(state));
    return Promise.all(promises);
}

// render sidebar
let sidebar = <FluxComponent
                flux={YT_FLUX}
                connectToStores={['user']}>
                    <Sidebar />
                </FluxComponent>;
React.render(sidebar, document.getElementById('yourturn-sidebar'));

// render notifications
let notificationBar = <FluxComponent
                        flux={YT_FLUX}
                        connectToStores={['notification']}>
                            <NotificationBar />
                    </FluxComponent>;
React.render(notificationBar, document.getElementById('yourturn-notifications'));

// render the rest
YT_FLUX
    .getActions('user')
    .fetchTokenInfo()
    .then(info => {
        YT_FLUX
            .getActions('user')
            .fetchUserTeams(info.uid);
    });

router.run(
    (Handler, state) => {
        fetchData(state.routes, state)
        .then(() => 
            React.render(<Handler globalFlux={YT_FLUX} />,
                         document.getElementById(MAIN_VIEW_ID))
        );
    });

/**
 * Continually dismiss old notifications.
 */
setInterval(() => {
    YT_FLUX
    .getActions('notification')
    .removeNotificationsOlderThan(5000);
}, 5000);