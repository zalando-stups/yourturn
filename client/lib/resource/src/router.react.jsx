import React from 'react';
import {Route, IndexRoute} from 'react-router';
import Config from 'common/src/config';

import REDUX from 'yourturn/src/redux';
import {connect} from 'react-redux';
import {
    bindGettersToState,
    bindActionsToStore
} from 'common/src/util';
import {wrapEnter, requireAccounts} from 'common/src/router-utils';

import * as UserGetter from 'common/src/data/user/user-getter';
import * as EssentialsGetter from 'common/src/data/essentials/essentials-getter';

import * as NotificationActions from 'common/src/data/notification/notification-actions';
import * as UserActions from 'common/src/data/user/user-actions';
import * as EssentialsActions from 'common/src/data/essentials/essentials-actions';

import ResourceForm from './resource-form/resource-form.jsx';
import ResourceList from './resource-list/resource-list.jsx';
import ResourceDetail from './resource-detail/resource-detail.jsx';
import ScopeDetail from './scope-detail/scope-detail.jsx';
import ScopeForm from './scope-form/scope-form.jsx';

const USER_STORE = undefined,
      ESSENTIALS_STORE = undefined,
      USER_ACTIONS = bindActionsToStore(REDUX, UserActions),
      ESSENTIALS_ACTIONS = bindActionsToStore(REDUX, EssentialsActions),
      NOTIFICATION_ACTIONS = bindActionsToStore(REDUX, NotificationActions);

// QUICKFIX #133
function isWhitelisted(token) {
    // ignore whitelist if it's empty
    if (Config.RESOURCE_WHITELIST.length === 0) {
        return true;
    }
    return token && Config.RESOURCE_WHITELIST.indexOf(token.uid) >= 0;
}

function requireToken(state, UserActions) {
    let tokeninfo = UserGetter.getTokenInfo(state.user);
    if (!tokeninfo.uid) {
        return UserActions.fetchTokenInfo();
    }
    return Promise.resolve(tokeninfo);
}

function requireWhitelisted(state) {
    let token = UserGetter.getTokenInfo(state.user);
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
        return <ResourceForm
                    edit={false}
                    essentialsActions={ESSENTIALS_ACTIONS}
                    notificationActions={ESSENTIALS_ACTIONS}
                    {...this.props} />;
    }
}
CreateResourceFormHandler.isAllowed = function(routerState, state) {
    return requireWhitelisted(state);
};
CreateResourceFormHandler.displayName = 'CreateResourceFormHandler';
CreateResourceFormHandler.propTypes = {
    params: React.PropTypes.object
};
CreateResourceFormHandler.fetchData = function(routerState, state) {
    return Promise.all([
        ESSENTIALS_ACTIONS.fetchResources(),
        requireToken(state, USER_ACTIONS)
    ]);
};
let ConnectedCreateResourceFormHandler = connect(state => ({
    essentialsStore: bindGettersToState(state.essentials, EssentialsGetter)
}))(CreateResourceFormHandler);


class EditResourceFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <ResourceForm
                    resourceId={this.props.params.resourceId}
                    edit={true}
                    notificationActions={NOTIFICATION_ACTIONS}
                    essentialsActions={ESSENTIALS_ACTIONS}
                    {...this.props} />;
    }
}
EditResourceFormHandler.isAllowed = function(routerState, state) {
    return requireWhitelisted(state);
};
EditResourceFormHandler.displayName = 'EditResourceFormHandler';
EditResourceFormHandler.propTypes = {
    params: React.PropTypes.object
};
EditResourceFormHandler.fetchData = function(routerState, state) {
    return Promise.all([
        ESSENTIALS_ACTIONS.fetchResource(routerState.params.resourceId),
        requireToken(state, USER_ACTIONS)
    ]);
};
let ConnectedEditResourceFormHandler = connect(state => ({
    essentialsStore: bindGettersToState(state.essentials, EssentialsGetter)
}))(EditResourceFormHandler);


class ResourceListHandler extends React.Component {
    constructor() {
        super();
    }
    render() {
        return <ResourceList {...this.props} />;
    }
}
ResourceListHandler.displayName = 'ResourceListHandler';
ResourceListHandler.propTypes = {
    params: React.PropTypes.object
};
ResourceListHandler.fetchData = function() {
    ESSENTIALS_ACTIONS.fetchResources();
};
let ConnectedResourceListHandler = connect(state => ({
    essentialsStore: bindGettersToState(state.essentials, EssentialsGetter),
    userStore: bindGettersToState(state.user, UserGetter)
}))(ResourceListHandler);

class ResourceDetailHandler extends React.Component {
    constructor() {
        super();
    }
    render() {
        return <ResourceDetail
                    resourceId={this.props.params.resourceId}
                    {...this.props} />;
    }
}
ResourceDetailHandler.displayName = 'ResourceDetailHandler';
ResourceDetailHandler.propTypes = {
    params: React.PropTypes.object
};
ResourceDetailHandler.fetchData = function(routerState) {
    ESSENTIALS_ACTIONS.fetchResource(routerState.params.resourceId);
    ESSENTIALS_ACTIONS.fetchScopes(routerState.params.resourceId);
};
let ConnectedResourceDetailHandler = connect(state => ({
    essentialsStore: bindGettersToState(state.essentials, EssentialsGetter),
    userStore: bindGettersToState(state.user, UserGetter)
}))(ResourceDetailHandler);

class ScopeDetailHandler extends React.Component {
    constructor() {
        super();
    }
    render() {
        return <ScopeDetail
                    resourceId={this.props.params.resourceId}
                    scopeId={this.props.params.scopeId}
                    {...this.props} />
    }
}
ScopeDetailHandler.displayName = 'ScopeDetailHandler';
ScopeDetailHandler.propTypes = {
    params: React.PropTypes.object
};
ScopeDetailHandler.fetchData = function(routerState) {
    let {resourceId, scopeId} = routerState.params;
    ESSENTIALS_ACTIONS.fetchResource(resourceId);
    ESSENTIALS_ACTIONS.fetchScope(resourceId, scopeId);
    ESSENTIALS_ACTIONS.fetchScopeApplications(resourceId, scopeId);
};
let ConnectedScopeDetailHandler = connect(state => ({
    essentialsStore: bindGettersToState(state.essentials, EssentialsGetter),
    userStore: bindGettersToState(state.user, UserGetter)
}))(ScopeDetailHandler);

class EditScopeFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <ScopeForm
                    resourceId={this.props.params.resourceId}
                    scopeId={this.props.params.scopeId}
                    edit={true}
                    notificationActions={NOTIFICATION_ACTIONS}
                    essentialsActions={ESSENTIALS_ACTIONS}
                    {...this.props} />;
    }
}
EditScopeFormHandler.isAllowed = function(routerState, state) {
    return requireWhitelisted(state);
};
EditScopeFormHandler.displayName = 'EditScopeFormHandler';
EditScopeFormHandler.propTypes = {
    params: React.PropTypes.object
};
EditScopeFormHandler.fetchData = function(routerState, state) {
    let {resourceId, scopeId} = routerState.params;
    ESSENTIALS_ACTIONS.fetchResource(resourceId);
    return Promise.all([
        ESSENTIALS_ACTIONS.fetchScope(resourceId, scopeId),
        requireToken(state, USER_ACTIONS)
    ]);
};
let ConnectedEditScopeFormHandler = connect(state => ({
    essentialsStore: bindGettersToState(state.essentials, EssentialsGetter)
}))(EditScopeFormHandler);

class CreateScopeFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <ScopeForm
                    resourceId={this.props.params.resourceId}
                    scopeId={this.props.params.scopeId}
                    edit={false}
                    notificationActions={NOTIFICATION_ACTIONS}
                    essentialsActions={ESSENTIALS_ACTIONS}
                    {...this.props} />;
    }
}
CreateScopeFormHandler.isAllowed = function(routerState, state) {
    return requireWhitelisted(state);
};
CreateScopeFormHandler.displayName = 'CreateScopeFormHandler';
CreateScopeFormHandler.propTypes = {
    params: React.PropTypes.object
};
CreateScopeFormHandler.fetchData = function(routerState, state) {
    let {resourceId} = routerState.params;
    ESSENTIALS_ACTIONS.fetchResource(resourceId);
    return Promise.all([
        ESSENTIALS_ACTIONS.fetchScopes(resourceId),
        requireToken(state, USER_ACTIONS)
    ]);
};
let ConnectedCreateScopeFormHandler = connect(state => ({
    essentialsStore: bindGettersToState(state.essentials, EssentialsGetter)
}))(CreateScopeFormHandler);

const ROUTES =
    <Route path='resource'>
        <IndexRoute
            onEnter={wrapEnter(ResourceListHandler.fetchData)}
            component={ConnectedResourceListHandler} />
        <Route
            path='create'
            onEnter={wrapEnter(CreateResourceFormHandler.fetchData, CreateResourceFormHandler.isAllowed)}
            component={ConnectedCreateResourceFormHandler} />
        <Route
            path='edit/:resourceId'
            onEnter={wrapEnter(EditResourceFormHandler.fetchData, EditResourceFormHandler.isAllowed)}
            component={ConnectedEditResourceFormHandler} />
        <Route
            path='detail/:resourceId'>
            <IndexRoute
                onEnter={wrapEnter(ResourceDetailHandler.fetchData)}
                component={ConnectedResourceDetailHandler} />
            <Route path='scope'>
                <Route
                    path='create'
                    onEnter={wrapEnter(CreateScopeFormHandler.fetchData, CreateScopeFormHandler.isAllowed)}
                    component={ConnectedCreateScopeFormHandler} />
                <Route
                    path='detail/:scopeId'
                    onEnter={wrapEnter(ScopeDetailHandler.fetchData)}
                    component={ConnectedScopeDetailHandler} />
                <Route
                    path='edit/:scopeId'
                    onEnter={wrapEnter(EditScopeFormHandler.fetchData, EditScopeFormHandler.isAllowed)}
                    component={ConnectedEditScopeFormHandler} />
            </Route>
        </Route>
    </Route>;

export default ROUTES;
