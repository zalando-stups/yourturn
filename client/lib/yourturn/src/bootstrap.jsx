import React from 'react';
import Router from 'react-router';
import ROUTES from './router.react.jsx';
import YT_FLUX from './flux';
import REDUX from './redux';
import {Provider} from 'react-redux';
import {bindActionsToStore} from 'common/src/util';
import * as KioActions from 'common/src/data/kio/kio-actions';
import * as UserActions from 'common/src/data/user/user-actions';
import DefaultError from 'common/src/error.jsx';

import 'common/asset/less/base.less';
import 'common/asset/less/grid.less';
import 'common/asset/less/yourturn/yourturn.less';

let router = Router.create({
    routes: ROUTES,
    location: Router.HistoryLocation
});

function isAllowed(routerState, state) {
    let errors = routerState
                    .routes
                    .map(route => route.handler.isAllowed ?
                        route.handler.isAllowed(routerState, state) :
                        true)
                    .filter(allowed => allowed instanceof Error);
    if (errors.length) {
        return errors[0];
    }
    return true;
}

function fetchData(routes, routerState) {
    let promises = routes
                    .filter(route => route.handler.fetchData !== undefined)
                    .map(route => route.handler.fetchData(routerState, REDUX.getState()));
    return Promise.all(promises);
}

let userActions = bindActionsToStore(REDUX, UserActions),
    kioActions = bindActionsToStore(REDUX, KioActions),
    fullstopActions = YT_FLUX.getActions('fullstop'),
    fullstopStore = YT_FLUX.getStore('fullstop');

// render the rest
userActions
    .fetchTokenInfo()
    .then(info => {
        fullstopActions.loadLastVisited();
        kioActions.loadPreferredAccount();
        userActions
            .fetchAccounts(info.uid)
            .then(accounts => {
                let lastLogin = fullstopStore.getLastVisited();
                fullstopActions.fetchOwnTotal(lastLogin, accounts.map(a => a.id));
            });
        userActions
            .fetchUserInfo(info.uid);
    });

router.run(
    (Handler, routerState) => {
        fetchData(routerState.routes, routerState, YT_FLUX)
        .then(() => {
            // before checking if user is allowed to see stuff,
            // we have to fetch the data
            // (i.e. to know the team of an application)
            let allowed = isAllowed(routerState, REDUX.getState());
            if (allowed !== true) {
                React.render(<Provider store={REDUX}>
                                {() => <DefaultError error={allowed} />}
                             </Provider>,
                             document.getElementById('yourturn-container'));
            } else {
                React.render(<Provider store={REDUX}>
                               {() => <Handler flux={YT_FLUX}/>}
                             </Provider>,
                             document.getElementById('yourturn-container'));
            }
        })
        .catch(err => {
            React.render(<DefaultError error={err} />, document.getElementById('yourturn-container'));
        });
    });
