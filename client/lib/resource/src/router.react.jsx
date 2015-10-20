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

const USER_STORE = FLUX.getStore('user'),
      USER_ACTIONS = FLUX.getActions('user'),
      ESSENTIALS_ACTIONS = FLUX.getActions('essentials'),
      ESSENTIALS_STORE = FLUX.getStore('essentials'),
      NOTIFICATION_ACTIONS = FLUX.getActions('notification');

// QUICKFIX #133
function isWhitelisted(token) {
    // ignore whitelist if it's empty
    if (Config.RESOURCE_WHITELIST.length === 0) {
        return true;
    }
    return token && Config.RESOURCE_WHITELIST.indexOf(token.uid) >= 0;
}

function requireToken() {
    const ACTIONS = USER_ACTIONS,
          STORE = USER_STORE;
    let tokeninfo = STORE.getTokenInfo();
    if (!tokeninfo.uid) {
        return ACTIONS.fetchTokenInfo();
    }
    return Promise.resolve(tokeninfo);
}

function requireWhitelisted() {
    let token = USER_STORE.getTokenInfo();
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
                        essentialsStore={ESSENTIALS_STORE}
                        essentialsActions={ESSENTIALS_ACTIONS}
                        notificationActions={ESSENTIALS_ACTIONS}
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
        ESSENTIALS_ACTIONS.fetchResources(),
        requireToken()
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
                        edit={true}
                        notificationActions={NOTIFICATION_ACTIONS}
                        essentialsActions={ESSENTIALS_ACTIONS}
                        essentialsStore={ESSENTIALS_STORE} />
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
        ESSENTIALS_ACTIONS.fetchResource(state.params.resourceId),
        requireToken()
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
                    <ResourceList
                        userStore={USER_STORE}
                        essentialsStore={ESSENTIALS_STORE} />
                </FlummoxComponent>;
    }
}
ResourceListHandler.displayName = 'ResourceListHandler';
ResourceListHandler.propTypes = {
    params: React.PropTypes.object
};
ResourceListHandler.fetchData = function() {
    ESSENTIALS_ACTIONS.fetchResources();
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
                        resourceId={this.props.params.resourceId}
                        userStore={USER_STORE}
                        essentialsStore={ESSENTIALS_STORE} />
                </FlummoxComponent>;
    }
}
ResourceDetailHandler.displayName = 'ResourceDetailHandler';
ResourceDetailHandler.propTypes = {
    params: React.PropTypes.object
};
ResourceDetailHandler.fetchData = function(state) {
    ESSENTIALS_ACTIONS.fetchResource(state.params.resourceId);
    ESSENTIALS_ACTIONS.fetchScopes(state.params.resourceId);
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
                        scopeId={this.props.params.scopeId}
                        userStore={USER_STORE}
                        essentialsStore={ESSENTIALS_STORE} />
                </FlummoxComponent>;
    }
}
ScopeDetailHandler.displayName = 'ScopeDetailHandler';
ScopeDetailHandler.propTypes = {
    params: React.PropTypes.object
};
ScopeDetailHandler.fetchData = function(state) {
    let {resourceId, scopeId} = state.params;
    ESSENTIALS_ACTIONS.fetchResource(resourceId);
    ESSENTIALS_ACTIONS.fetchScope(resourceId, scopeId);
    ESSENTIALS_ACTIONS.fetchScopeApplications(resourceId, scopeId);
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
                        edit={true}
                        notificationActions={NOTIFICATION_ACTIONS}
                        essentialsActions={ESSENTIALS_ACTIONS}
                        essentialsStore={ESSENTIALS_STORE} />
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
    ESSENTIALS_ACTIONS.fetchResource(resourceId);
    return Promise.all([
        ESSENTIALS_ACTIONS.fetchScope(resourceId, scopeId),
        requireToken()
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
                        edit={false}
                        notificationActions={NOTIFICATION_ACTIONS}
                        essentialsActions={ESSENTIALS_ACTIONS}
                        essentialsStore={ESSENTIALS_STORE} />
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
    ESSENTIALS_ACTIONS.fetchResource(resourceId);
    return Promise.all([
        ESSENTIALS_ACTIONS.fetchScopes(resourceId),
        requireToken()
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
