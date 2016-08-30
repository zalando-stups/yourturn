/* global ENV_DEVELOPMENT */

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
import {handleError} from 'common/src/router-utils';
import {Provider as OAuthProvider} from '@zalando/oauth2-client-js';

import 'common/asset/less/base.less';
import 'common/asset/less/grid.less';
import 'common/asset/less/yourturn/yourturn.less';

let userActions = bindActionsToStore(REDUX, UserActions),
    kioActions = bindActionsToStore(REDUX, KioActions),
    fullstopActions = bindActionsToStore(REDUX, FullstopActions);

// render the rest
if (ENV_DEVELOPMENT) {
    const provider = new OAuthProvider({
        id: 'stups',
        authorization_url: 'OAUTH_AUTH_URL'
    });
    provider.setAccessToken('mytoken');
}

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
