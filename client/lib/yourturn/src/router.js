import {Router, history} from 'backbone';
import Search from 'yourturn/src/search/search';
import puppeteer from 'common/src/puppeteer';
import {Provider} from 'common/src/oauth-provider';
import {Error} from 'oauth2-client-js';
import Flux from './flux';

const NOTIFICATIONS = Flux.getActions('notification');
const MAIN_VIEW_ID = '#yourturn-view';

class YourturnRouter extends Router {
    constructor() {
        super({
            routes: {
                '': 'search',
                'search': 'search',
                'oauth': 'oauth'
            }
        });
    }

    search() {
        puppeteer.show(new Search(), MAIN_VIEW_ID);
    }

    oauth() {
        let response;
        try {
            response = Provider.parse(window.location.hash);
        } catch(err) {
            NOTIFICATIONS.addNotification('OAuth: Unexpected response. This should not happen.', 'error');
        }
        if (response) {
            if (response instanceof Error) {
                return NOTIFICATIONS.addNotification('OAuth: ' + response.error + ' ' + response.error_description, 'error');
            }
            history.navigate(response.metadata.route || '/', { trigger: true });
        }
    }
}

export default YourturnRouter;
