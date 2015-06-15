import React from 'react';
import {Route} from 'react-router';
import FlummoxComponent from 'flummox/component';
import YT_FLUX from './flux';
import AppRoutes from 'application/src/router.react.jsx';
import ResRoutes from 'resource/src/router.react.jsx';
import VioRoutes from 'violation/src/router.react.jsx';
import Search from 'yourturn/src/search/search.jsx';

import {Provider} from 'common/src/oauth-provider';
import {Error} from 'oauth2-client-js';
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
                    <Search />
                </FlummoxComponent>;
    }
}

const ROUTES =
    <Route path='/'>
        {AppRoutes}
        {ResRoutes}
        {VioRoutes}
        <Route path='search' handler={SearchHandler} />
        <Route path='oauth' handler={LoginHandler} />
    </Route>;

export default ROUTES;