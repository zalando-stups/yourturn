import {Router, history} from 'backbone';
import Search from 'yourturn/src/search/search';
import puppeteer from 'common/src/puppeteer';
import Provider from 'common/src/oauth-provider';

class YourturnRouter extends Router {
    constructor() {
        this.routes = {
            '': 'search',
            'search': 'search',
            'oauth': 'auth'
        };
        super();
    }

    search() {
        puppeteer.show(new Search(), '#yourturn-view');
    }

    auth() {
        let request;
        try {
            request = Provider.parse(window.location.hash);
        } catch(err) {
            // this means we can't decide if the response is an error or success
            // or it was not expected. in either case we should do something.
        }
        if (request) {
            //TODO some kind of error hint might be cool
            history.navigate(request.attemptedRoute || '/', { trigger: true });
        }
    }
}

export default YourturnRouter;