import {Router, history} from 'backbone';
import Flux from './flux';
import puppeteer from 'common/src/puppeteer';

const MAIN_VIEW_ID = '#yourturn-view',
    VIO_FLUX = new Flux();

class ViolationRouter extends Router {
    constructor(props) {
        super({
            routes: {
                'violation': 'listViolations'
            }
        });
        this.globalFlux = props.globalFlux;
    }

    listViolations() {
        alert('VIOLATOR');
    }
}

export default ViolationRouter;
