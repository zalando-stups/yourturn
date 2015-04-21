import {Router, history} from 'backbone';
import Search from 'yourturn/src/search/search';
import puppeteer from 'common/src/puppeteer';
import {Provider} from 'common/src/oauth-provider';

class YourturnRouter extends Router {
    constructor() {
        this.routes = {
            '': 'search',
            'search': 'search',
            'oauth': 'oauth'
        };
        super();
    }

    search() {
        puppeteer.show(new Search(), '#yourturn-view');
    }

    oauth() {
        let response;
        try {
            response = Provider.parse(window.location.hash);
        } catch(err) {
            // this means we can't decide if the response is an error or success
            // or it was not expected. in either case we should do something.
            //
            // this is left empty intentionally for now
        }
        if (response) {
            //TODO some kind of error hint might be cool
            history.navigate(response.metadata.route || '/', { trigger: true });
        }
    }
}

export default YourturnRouter;
