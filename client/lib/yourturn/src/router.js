import {Router} from 'backbone';

class YourturnRouter extends Router {
    constructor() {
        this.routes = {
            '': 'home'
        };
        super();
    }

    home() {}
}

export default YourturnRouter;