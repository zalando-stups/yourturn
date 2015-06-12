import {Router} from 'backbone';
import Flux from './flux';
import ViolationList from 'violation/src/violation-list/violation-list';
import puppeteer from 'common/src/puppeteer';

const MAIN_VIEW_ID = '#yourturn-view',
    VIO_FLUX = new Flux(),
    VIO_ACTIONS = VIO_FLUX.getActions('fullstop');

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
        var userStore = this.globalFlux.getStore('user');
        let accounts = userStore.getUserCloudAccounts();
        if (accounts.length === 0 || accounts.isPending && accounts.isPending()) {
            return;
        } else {
            let accountIds = accounts.map(a => a.id);
            VIO_ACTIONS.fetchViolations(accountIds);
            puppeteer.show(new ViolationList({
                flux: VIO_FLUX,
                globalFlux: this.globalFlux
            }), MAIN_VIEW_ID);
        }
    }
}

export default ViolationRouter;
