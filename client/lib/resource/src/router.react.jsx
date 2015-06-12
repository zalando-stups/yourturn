import React from 'react';
import FlummoxComponent from 'flummox/component';
import {Route, DefaultRoute} from 'react-router';
import Config from 'common/src/config';
import Flux from './flux';
import ResourceList from './resource-list/resource-list.jsx';
import ResourceDetail from './resource-detail/resource-detail.jsx';
import ScopeDetail from './scope-detail/scope-detail.jsx';

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


class ResourceDetailHandler extends React.Component {
    constructor() {
        super();
    }
    render() {
        return <FlummoxComponent
                    flux={RES_FLUX}
                    globalFlux={this.props.globalFlux}
                    connectToStores={['essentials']}>
                    <ResourceDetail
                        resourceId={this.props.params.resourceId} />
                </FlummoxComponent>;
    }
}
ResourceDetailHandler.fetchData = function(state) {
    RES_ACTIONS.fetchResource(state.params.resourceId);
    RES_ACTIONS.fetchScopes(state.params.resourceId);
};


class ScopeDetailHandler extends React.Component {
    constructor() {
        super();
    }
    render() {
        return <FlummoxComponent
                    flux={RES_FLUX}
                    globalFlux={this.props.globalFlux}
                    connectToStores={['essentials']}>
                    <ScopeDetail
                        resourceId={this.props.params.resourceId}
                        scopeId={this.props.params.scopeId} />
                </FlummoxComponent>;
    }
}
ScopeDetailHandler.fetchData = function(state) {
    let {resourceId, scopeId} = state.params;
    RES_ACTIONS.fetchResource(resourceId);
    RES_ACTIONS.fetchScope(resourceId, scopeId);
};

const ROUTES =
    <Route path='resource'>
        <DefaultRoute handler={ResourceListHandler} />
        <Route path='detail/:resourceId'>
            <DefaultRoute handler={ResourceDetailHandler} />
            <Route path='scope'>
                <Route path='detail/:scopeId' handler={ScopeDetailHandler} />
            </Route>
        </Route>
    </Route>;

export default ROUTES;
