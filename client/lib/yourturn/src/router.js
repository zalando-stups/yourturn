import {Router, history} from 'backbone';
import Search from 'yourturn/src/search/search';
import puppeteer from 'common/src/puppeteer';
import {Provider} from 'common/src/oauth-provider';
import {Error} from 'oauth2-client-js';
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
            history.navigate(response.metadata.route || '/', {trigger: true});
        }
    }
}

export default YourturnRouter;
