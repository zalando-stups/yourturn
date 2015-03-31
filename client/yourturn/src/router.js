import {Router} from 'backbone';

class YourturnRouter extends Router {
    constructor() {
        this.routes = {
            '': 'home'
        };
        super();
    }

    home() {
        console.log( 'at home' );
    }
}

export default YourturnRouter;