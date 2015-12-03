import React from 'react';
import Router from 'react-router';
import ROUTES from './router.react.jsx';
import YT_FLUX from './flux';
import DefaultError from 'common/src/error.jsx';

import 'common/asset/less/base.less';
import 'common/asset/less/grid.less';
import 'common/asset/less/yourturn/yourturn.less';

let router = Router.create({
    routes: ROUTES,
    location: Router.HistoryLocation
});

function isAllowed(state) {
    let errors = state
                    .routes
                    .map(route => route.handler.isAllowed ?
                        route.handler.isAllowed(state) :
                        true)
                    .filter(allowed => allowed instanceof Error);
    if (errors.length) {
        return errors[0];
    }
    return true;
}

function fetchData(routes, state) {
    let promises = routes
                    .filter(route => route.handler.fetchData !== undefined)
                    .map(route => route.handler.fetchData(state));
    return Promise.all(promises);
}

let userActions = YT_FLUX.getActions('user');

// render the rest
userActions
    .fetchTokenInfo()
    .then(info => {
        userActions
            .fetchAccounts(info.uid);
        userActions
            .fetchUserInfo(info.uid);
    });

router.run(
    (Handler, state) => {
        fetchData(state.routes, state, YT_FLUX)
        .then(() => {
            // before checking if user is allowed to see stuff,
            // we have to fetch the data
            // (i.e. to know the team of an application)
            let authError = isAllowed(state);
            if (authError !== true) {
                // if auth error true => everythings good
                // I KNOW!
                React.render(<DefaultError error={authError} />,
                             document.body);
            } else {
                React.render(<Handler flux={YT_FLUX}/>,
                    document.getElementById('yourturn-container'));
            }
        });
    });


/**
 * Continually dismiss old notifications.
 */
setInterval(() => {
    YT_FLUX.getActions('notification')
    .removeNotificationsOlderThan(5000);
}, 5000);
