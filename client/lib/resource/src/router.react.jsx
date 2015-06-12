import React from 'react';
import FlummoxComponent from 'flummox/component';
import {Route, DefaultRoute} from 'react-router';
import Config from 'common/src/config';
import Flux from './flux';
import ResourceList from './resource-list/resource-list.jsx';

import 'promise.prototype.finally';

const RES_FLUX = new Flux(),
      RES_ACTIONS = RES_FLUX.getActions('essentials');

class ResourceListHandler extends React.Component {
    constructor() {
        super();
    }
    render() {
        return <FlummoxComponent
                    flux={RES_FLUX}
                    globalFlux={this.props.globalFlux}
                    connectToStores={['essentials']}>
                    <ResourceList />
                </FlummoxComponent>;
    }
}
ResourceListHandler.fetchData = function(state) {
    RES_ACTIONS.fetchResources();
};

const ROUTES =
    <Route path='resource'>
        <DefaultRoute handler={ResourceListHandler} />
    </Route>;

export default ROUTES;
