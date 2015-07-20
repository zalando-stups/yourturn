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

function isAllowed(state, globalFlux) {
    let errors = state
                    .routes
                    .map(route => route.handler.isAllowed ?
                        route.handler.isAllowed(state, globalFlux) :
                        true)
                    .filter(allowed => allowed instanceof Error);
    if (errors.length) {
        return errors[0];
    }
    return true;
}

function fetchData(routes, state, globalFlux) {
    let promises = routes
                    .filter(route => route.handler.fetchData !== undefined)
                    .map(route => route.handler.fetchData(state, globalFlux));
    return Promise.all(promises);
}

// render the rest
YT_FLUX
    .getActions('user')
    .fetchTokenInfo()
    .then(info => {
        YT_FLUX
            .getActions('user')
            .fetchTeamMembership(info.uid);
        YT_FLUX
            .getActions('user')
            .fetchAccounts(info.uid);
        YT_FLUX
            .getActions('user')
            .fetchUserInfo(info.uid);
    });

router.run(
    (Handler, state) => {
        fetchData(state.routes, state, YT_FLUX)
        .then(() => {
            // before checking if user is allowed to see stuff,
            // we have to fetch the data
            // (i.e. to know the team of an application)
            let authError = isAllowed(state, YT_FLUX);
            if (authError !== true) {
                // if auth error true => everythings good
                // I KNOW!
                React.render(<DefaultError error={authError} />,
                             document.body);
            } else {
                React.render(<Handler globalFlux={YT_FLUX} />,
                             document.body);
            }
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
