import React from 'react';
import {Route, DefaultRoute} from 'react-router';
import FlummoxComponent from 'flummox/component';
import YT_FLUX from './flux';
import AppRoutes from 'application/src/router.react.jsx';
import ResRoutes from 'resource/src/router.react.jsx';
import VioRoutes from 'violation/src/router.react.jsx';
import YourTurn from './app.jsx';
import Search from 'yourturn/src/search/search.jsx';

import {Provider} from 'common/src/oauth-provider';
import {Error} from '@zalando/oauth2-client-js';
import validate from './validate-oauth-response';

class LoginHandler extends React.Component {
    constructor() {
        super();
    }

    componentDidMount() {
        let response;
        try {
            response = Provider.parse(window.location.hash);
        } catch (err) {
            YT_FLUX
            .getActions('notification')
            .addNotification(
                'OAuth: Unexpected response. This should not happen.',
                'error');
            return this.context.router.transitionTo('/');
        }
        if (response) {
            if (response instanceof Error) {
                return YT_FLUX
                            .getActions('notification')
                            .addNotification(
                                'OAuth: ' + response.error + ' ' + response.getMessage(),
                                'error');
            }
            // successful response with access_token
            // validate with business logic
            validate(YT_FLUX)
                .then(() => {
                    // everything's good!
                    // run the same stuff from bootstrap now
                    let info = YT_FLUX
                                .getStore('user')
                                .getTokenInfo();

                    YT_FLUX
                        .getActions('user')
                        .fetchAccounts(info.uid)
                        .then(accounts => {
                            YT_FLUX.getActions('fullstop').loadLastVisited();
                            YT_FLUX
                                .getActions('fullstop')
                                .fetchOwnTotal(
                                    YT_FLUX.getStore('fullstop').getLastVisited(),
                                    accounts.map(a => a.id));
                        });
                    YT_FLUX
                        .getActions('user')
                        .fetchUserInfo(info.uid);

                    this.context.router.transitionTo(response.metadata.route || '/');
                })
                .catch(e => {
                    // delete tokens
                    YT_FLUX.getActions('user').deleteTokenInfo();
                    return YT_FLUX
                            .getActions('notification')
                            .addNotification(
                                'Token validation failed: ' + e.message,
                                'error');
                });
        }
    }

    render() {
        return null;
    }
}
LoginHandler.displayName = 'LoginHandler';
LoginHandler.contextTypes = {
    router: React.PropTypes.func.isRequired
};


class SearchHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <FlummoxComponent
                    connectToStores={['search']}
                    flux={YT_FLUX}>
                    <Search
                        searchActions={YT_FLUX.getActions('search')}
                        searchStore={YT_FLUX.getStore('search')}/>
                </FlummoxComponent>;
    }
}
SearchHandler.displayName = 'SearchHandler';

const ROUTES =
    <Route handler={YourTurn} path='/'>
        {AppRoutes}
        {ResRoutes}
        {VioRoutes}
        <DefaultRoute name='search' path='search' handler={SearchHandler} />
        <Route path='oauth' handler={LoginHandler} />
    </Route>;

export default ROUTES;
