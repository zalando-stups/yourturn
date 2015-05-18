import {Router, history} from 'backbone';
import Search from 'yourturn/src/search/search';
import puppeteer from 'common/src/puppeteer';
import {Provider} from 'common/src/oauth-provider';
import {Error} from 'oauth2-client-js';
import LoginHandler from './login';

const MAIN_VIEW_ID = '#yourturn-view';

class YourturnRouter extends Router {
    constructor(props) {
        super({
            routes: {
                '': 'search',
                'search': 'search',
                'oauth': 'oauth'
            }
        });
        this.flux = props.flux;
        this.loginHandler = new LoginHandler(props.flux);
    }

    search() {
        puppeteer.show(new Search({
            flux: this.flux
        }), MAIN_VIEW_ID);
    }

    oauth() {
        let response;
        try {
            response = Provider.parse(window.location.hash);
        } catch (err) {
            this.flux
            .getActions('notification')
            .addNotification(
                'OAuth: Unexpected response. This should not happen.',
                'error');
            return history.navigate('/', {trigger: true});
        }
        if (response) {
            if (response instanceof Error) {
                return this.flux
                            .getActions('notification')
                            .addNotification(
                                'OAuth: ' + response.error + ' ' + response.getMessage(),
                                'error');
            }
            // successful response with access_token
            // validate with business logic
            this.loginHandler
                .validateResponse()
                .then(() => {
                    // everything's good!
                    return history.navigate(response.metadata.route || '/', {trigger: true});
                })
                .catch(e => {
                    // delete tokens
                    this.flux.getActions('tokeninfo').deleteTokenInfo();
                    return this.flux
                            .getActions('notification')
                            .addNotification(
                                'Token validation failed: ' + e.message,
                                'error');
                });
        }
    }
}

export default YourturnRouter;
