import {Router} from 'backbone';
import Search from 'yourturn/src/search/search';
import puppeteer from 'common/src/puppeteer';

class YourturnRouter extends Router {
    constructor() {
        this.routes = {
            '': 'search',
            'search': 'search'
        };
        super();
    }

    search() {
        puppeteer.show( new Search(), '#yourturn-view' );
    }
}

export default YourturnRouter;