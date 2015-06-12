import React from 'react';
import {Route} from 'react-router';
import YT_FLUX from './flux';
import AppRoutes from 'application/src/router.react.jsx';
import ResRoutes from 'resource/src/router.react.jsx';

// import Search from 'yourturn/src/search/search';
// import puppeteer from 'common/src/puppeteer';
import {Provider} from 'common/src/oauth-provider';
import {Error} from 'oauth2-client-js';
import validate from './validate-oauth-response';

// const MAIN_VIEW_ID = '#yourturn-view';
// 

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

const ROUTES =
    <Route path='/'>
        {AppRoutes}
        {ResRoutes}
        <Route path='oauth' handler={LoginHandler} />
    </Route>;

export default ROUTES;