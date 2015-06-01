import {Flummox} from 'flummox';

import KioActions from 'common/src/data/kio/kio-actions';
import KioStore from 'common/src/data/kio/kio-store';

import TwintipActions from 'common/src/data/twintip/twintip-actions';
import TwintipStore from 'common/src/data/twintip/twintip-store';

import ResourceActions from 'common/src/data/resource/resource-actions';
import ResourceStore from 'common/src/data/resource/resource-store';

import MintActions from 'common/src/data/mint/mint-actions';
import MintStore from 'common/src/data/mint/mint-store';

import PieroneActions from 'common/src/data/pierone/pierone-actions';
import PieroneStore from 'common/src/data/pierone/pierone-store';

class AppFlux extends Flummox {
    constructor() {
        super();

        this.createActions('kio', KioActions);
        this.createStore('kio', KioStore, this);

        this.createActions('twintip', TwintipActions);
        this.createStore('twintip', TwintipStore, this);

        this.createActions('resource', ResourceActions);
        this.createStore('resource', ResourceStore, this);

        this.createActions('mint', MintActions);
        this.createStore('mint', MintStore, this);

        this.createActions('pierone', PieroneActions);
        this.createStore('pierone', PieroneStore, this);
    }
}

export default AppFlux;
