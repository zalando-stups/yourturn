import React from 'react';
import FlummoxComponent from 'flummox/component';
import {Route, DefaultRoute} from 'react-router';
import Config from 'common/src/config';
import FLUX from 'yourturn/src/flux';
import ResourceForm from './resource-form/resource-form.jsx';
import ResourceList from './resource-list/resource-list.jsx';
import ResourceDetail from './resource-detail/resource-detail.jsx';
import ScopeDetail from './scope-detail/scope-detail.jsx';
import ScopeForm from './scope-form/scope-form.jsx';

const RES_ACTIONS = FLUX.getActions('essentials');

// QUICKFIX #133
function isWhitelisted(token) {
    // ignore whitelist if it's empty
    if (Config.RESOURCE_WHITELIST.length === 0) {
        return true;
    }
    return token && Config.RESOURCE_WHITELIST.indexOf(token.uid) >= 0;
}

function requireToken(flux) {
    const ACTIONS = flux.getActions('user'),
          STORE = flux.getStore('user');
    let tokeninfo = STORE.getTokenInfo();
    if (!tokeninfo.uid) {
        return ACTIONS.fetchTokenInfo();
    }
    return Promise.resolve(tokeninfo);
}

function requireWhitelisted(flux) {
    let token = flux.getStore('user').getTokenInfo();
    if (!isWhitelisted(token)) {
        let error = new Error();
        error.name = 'Not whitelisted';
        error.message = 'You are not allowed to view this page. Sorry!';
        error.status = 'u1F62D';
        return error;
    }
    return true;
}

class CreateResourceFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <FlummoxComponent
                    flux={FLUX}
                    connectToStores={['essentials']}>
                    <ResourceForm
                        edit={false} />
                </FlummoxComponent>;
    }
}
CreateResourceFormHandler.isAllowed = function() {
    return requireWhitelisted(FLUX);
};
CreateResourceFormHandler.displayName = 'CreateResourceFormHandler';
CreateResourceFormHandler.propTypes = {
    params: React.PropTypes.object
};
CreateResourceFormHandler.fetchData = function() {
    return Promise.all([
        RES_ACTIONS.fetchResources(),
        requireToken(FLUX)
    ]);
};


class EditResourceFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <FlummoxComponent
                    flux={FLUX}
                    connectToStores={['essentials']}>
                    <ResourceForm
                        resourceId={this.props.params.resourceId}
                        edit={true} />
                </FlummoxComponent>;
    }
}
EditResourceFormHandler.isAllowed = function() {
    return requireWhitelisted(FLUX);
};
EditResourceFormHandler.displayName = 'EditResourceFormHandler';
EditResourceFormHandler.propTypes = {
    params: React.PropTypes.object
};
EditResourceFormHandler.fetchData = function(state) {
    return Promise.all([
        RES_ACTIONS.fetchResource(state.params.resourceId),
        requireToken(FLUX)
    ]);
};

class ResourceListHandler extends React.Component {
    constructor() {
        super();
    }
    render() {
        return <FlummoxComponent
                    flux={FLUX}
                    connectToStores={['essentials']}>
                    <ResourceList />
                </FlummoxComponent>;
    }
}
ResourceListHandler.displayName = 'ResourceListHandler';
ResourceListHandler.propTypes = {
    params: React.PropTypes.object
};
ResourceListHandler.fetchData = function() {
    RES_ACTIONS.fetchResources();
};


class ResourceDetailHandler extends React.Component {
    constructor() {
        super();
    }
    render() {
        return <FlummoxComponent
                    flux={FLUX}
                    connectToStores={['essentials']}>
                    <ResourceDetail
                        resourceId={this.props.params.resourceId} />
                </FlummoxComponent>;
    }
}
ResourceDetailHandler.displayName = 'ResourceDetailHandler';
ResourceDetailHandler.propTypes = {
    params: React.PropTypes.object
};
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
                    flux={FLUX}
                    connectToStores={['essentials']}>
                    <ScopeDetail
                        resourceId={this.props.params.resourceId}
                        scopeId={this.props.params.scopeId} />
                </FlummoxComponent>;
    }
}
ScopeDetailHandler.displayName = 'ScopeDetailHandler';
ScopeDetailHandler.propTypes = {
    params: React.PropTypes.object
};
ScopeDetailHandler.fetchData = function(state) {
    let {resourceId, scopeId} = state.params;
    RES_ACTIONS.fetchResource(resourceId);
    RES_ACTIONS.fetchScope(resourceId, scopeId);
    RES_ACTIONS.fetchScopeApplications(resourceId, scopeId);
};


class EditScopeFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <FlummoxComponent
                    flux={FLUX}
                    connectToStores={['essentials']}>
                    <ScopeForm
                        resourceId={this.props.params.resourceId}
                        scopeId={this.props.params.scopeId}
                        edit={true} />
                </FlummoxComponent>;
    }
}
EditScopeFormHandler.isAllowed = function() {
    return requireWhitelisted(FLUX);
};
EditScopeFormHandler.displayName = 'EditScopeFormHandler';
EditScopeFormHandler.propTypes = {
    params: React.PropTypes.object
};
EditScopeFormHandler.fetchData = function(state) {
    let {resourceId, scopeId} = state.params;
    RES_ACTIONS.fetchResource(resourceId);
    return Promise.all([
        RES_ACTIONS.fetchScope(resourceId, scopeId),
        requireToken(FLUX)
    ]);
};


class CreateScopeFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <FlummoxComponent
                    flux={FLUX}
                    connectToStores={['essentials']}>
                    <ScopeForm
                        resourceId={this.props.params.resourceId}
                        scopeId={this.props.params.scopeId}
                        edit={false} />
                </FlummoxComponent>;
    }
}
CreateScopeFormHandler.isAllowed = function() {
    return requireWhitelisted(FLUX);
};
CreateScopeFormHandler.displayName = 'CreateScopeFormHandler';
CreateScopeFormHandler.propTypes = {
    params: React.PropTypes.object
};
CreateScopeFormHandler.fetchData = function(state) {
    let {resourceId} = state.params;
    RES_ACTIONS.fetchResource(resourceId);
    return Promise.all([
        RES_ACTIONS.fetchScopes(resourceId),
        requireToken(FLUX)
    ]);
};

const ROUTES =
    <Route name='resource-resList' path='resource'>
        <DefaultRoute handler={ResourceListHandler} />
        <Route name='resource-resCreate' path='create' handler={CreateResourceFormHandler} />
        <Route name='resource-resEdit' path='edit/:resourceId' handler={EditResourceFormHandler} />
        <Route name='resource-resDetail' path='detail/:resourceId'>
            <DefaultRoute handler={ResourceDetailHandler} />
            <Route path='scope'>
                <Route name='resource-scpCreate' path='create' handler={CreateScopeFormHandler} />
                <Route name='resource-scpDetail' path='detail/:scopeId' handler={ScopeDetailHandler} />
                <Route name='resource-scpEdit' path='edit/:scopeId' handler={EditScopeFormHandler} />
            </Route>
        </Route>
    </Route>;

export default ROUTES;
