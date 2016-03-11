import React from 'react';
import ReactDOM from 'react-dom';
import {Router, browserHistory} from 'react-router';
import ROUTES from './router.react.jsx';
import REDUX from './redux';
import {Provider} from 'react-redux';
import {bindActionsToStore} from 'common/src/util';
import * as KioActions from 'common/src/data/kio/kio-actions';
import * as UserActions from 'common/src/data/user/user-actions';
import * as FullstopActions from 'common/src/data/fullstop/fullstop-actions';
import * as FullstopGetter from 'common/src/data/fullstop/fullstop-getter';
import {handleError} from 'common/src/router-utils';


import 'common/asset/less/base.less';
import 'common/asset/less/grid.less';
import 'common/asset/less/yourturn/yourturn.less';

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


let userActions = bindActionsToStore(REDUX, UserActions),
    kioActions = bindActionsToStore(REDUX, KioActions),
    fullstopActions = bindActionsToStore(REDUX, FullstopActions);

// render the rest
userActions
    .fetchTokenInfo()
    .then(info => {
        kioActions.loadPreferredAccount();
        userActions
            .fetchAccounts(info.uid)
            .then(accounts => fullstopActions.fetchOwnTotal(accounts.map(a => a.id)));
        userActions
            .fetchUserInfo(info.uid);
    });

ReactDOM.render(<Provider store={REDUX}>
                   <Router onError={handleError} history={browserHistory}>{ROUTES}</Router>
                 </Provider>,
                 document.getElementById('yourturn-container'));
