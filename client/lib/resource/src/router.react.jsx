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
import {getApplicationFromResource} from 'resource/src/util';

import * as UserGetter from 'common/src/data/user/user-getter';
import * as KioGetter from 'common/src/data/kio/kio-getter';
import * as EssentialsGetter from 'common/src/data/essentials/essentials-getter';

import * as NotificationActions from 'common/src/data/notification/notification-actions';
import * as UserActions from 'common/src/data/user/user-actions';
import * as EssentialsActions from 'common/src/data/essentials/essentials-actions';
import * as KioActions from 'common/src/data/kio/kio-actions';

import ResourceForm from './resource-form/resource-form.jsx';
import ResourceList from './resource-list/resource-list.jsx';
import ResourceDetail from './resource-detail/resource-detail.jsx';
import ScopeDetail from './scope-detail/scope-detail.jsx';
import ScopeForm from './scope-form/scope-form.jsx';

const USER_ACTIONS = bindActionsToStore(REDUX, UserActions),
      ESSENTIALS_ACTIONS = bindActionsToStore(REDUX, EssentialsActions),
      NOTIFICATION_ACTIONS = bindActionsToStore(REDUX, NotificationActions),
      KIO_ACTIONS = bindActionsToStore(REDUX, KioActions);

function requireToken(state, UserActions) {
    let tokeninfo = UserGetter.getTokenInfo(state.user);
    if (!tokeninfo.uid) {
        return UserActions.fetchTokenInfo();
    }
    return Promise.resolve(tokeninfo);
}

function isWhitelistedOrOwner(userAccounts, app, whitelisted) {
    return app && app.team_id ? userAccounts.indexOf(app.team_id) !== -1 : whitelisted;
}

function requireWhitelistedOrOwner(state, token, app) {
    const whitelisted = UserGetter.isTokenWhitelisted(token),
          userAccounts = UserGetter.getUserCloudAccounts(state.user).map(a => a.name);
    if (!isWhitelistedOrOwner(userAccounts, app, whitelisted)) {
        let error = new Error();
        error.name = 'Not allowed';
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
        const existingResourceIds = this.props.essentialsStore.getResources().map(r => r.id),
              whitelisted = this.props.userStore.isWhitelisted(),
              userAccounts = this.props.userStore.getUserCloudAccounts().map(a => a.name);
        return <ResourceForm
                    edit={false}
                    essentialsActions={ESSENTIALS_ACTIONS}
                    notificationActions={ESSENTIALS_ACTIONS}
                    kioActions={KIO_ACTIONS}
                    userAccounts={userAccounts}
                    isUserWhitelisted={whitelisted}
                    existingResourceIds={existingResourceIds} />;
    }
}
CreateResourceFormHandler.displayName = 'CreateResourceFormHandler';
CreateResourceFormHandler.propTypes = {
    params: React.PropTypes.object
};
CreateResourceFormHandler.fetchData = function(routerState, state) {
    return Promise.all([
        ESSENTIALS_ACTIONS.fetchResources(),
        requireAccounts(state, USER_ACTIONS)
    ]);
};
let ConnectedCreateResourceFormHandler = connect(state => ({
    essentialsStore: bindGettersToState(state.essentials, EssentialsGetter),
    userStore: bindGettersToState(state.user, UserGetter)
}))(CreateResourceFormHandler);


class EditResourceFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        const resource = this.props.essentialsStore.getResource(this.props.params.resourceId);
        return <ResourceForm
                    resourceId={this.props.params.resourceId}
                    edit={true}
                    notificationActions={NOTIFICATION_ACTIONS}
                    essentialsActions={ESSENTIALS_ACTIONS}
                    resource={resource} />;
    }
}
EditResourceFormHandler.isAllowed = function(routerState, state, [token, , app]) {
    return requireWhitelistedOrOwner(state, token, app);
};
EditResourceFormHandler.displayName = 'EditResourceFormHandler';
EditResourceFormHandler.propTypes = {
    params: React.PropTypes.object
};
EditResourceFormHandler.fetchData = function(routerState, state) {
    const app = getApplicationFromResource(routerState.params.resourceId),
          // we have to catch here as otherwise the route component is not displayed at all and the
          // app might not exist
          appPromise = app ? KIO_ACTIONS.fetchApplication(app).catch(e => undefined) : Promise.resolve();
    return Promise.all([
        requireToken(state, USER_ACTIONS),
        ESSENTIALS_ACTIONS.fetchResource(routerState.params.resourceId),
        appPromise
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
        const resources = this.props.essentialsStore.getResources()
        return <ResourceList resources={resources} />;
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
    essentialsStore: bindGettersToState(state.essentials, EssentialsGetter)
}))(ResourceListHandler);

class ResourceDetailHandler extends React.Component {
    constructor() {
        super();
    }
    render() {
        const {resourceId} = this.props.params,
              userAccounts = this.props.userStore.getUserCloudAccounts().map(a => a.name),
              application = this.props.kioStore.getApplication(getApplicationFromResource(resourceId)),
              resource = this.props.essentialsStore.getResource(resourceId),
              scopes = this.props.essentialsStore.getScopes(resourceId),
              whitelisted = this.props.userStore.isWhitelisted(),
              canEdit = isWhitelistedOrOwner(userAccounts, application, whitelisted);
        return <ResourceDetail
                    resource={resource}
                    canEdit={canEdit}
                    scopes={scopes}
                    resourceId={resourceId} />;
    }
}
ResourceDetailHandler.displayName = 'ResourceDetailHandler';
ResourceDetailHandler.propTypes = {
    params: React.PropTypes.object
};
ResourceDetailHandler.fetchData = function(routerState) {
    ESSENTIALS_ACTIONS.fetchResource(routerState.params.resourceId);
    ESSENTIALS_ACTIONS.fetchScopes(routerState.params.resourceId);
    const appId = getApplicationFromResource(routerState.params.resourceId);
    if (appId) {
        KIO_ACTIONS.fetchApplication(appId);
    }
};
let ConnectedResourceDetailHandler = connect(state => ({
    essentialsStore: bindGettersToState(state.essentials, EssentialsGetter),
    userStore: bindGettersToState(state.user, UserGetter),
    kioStore: bindGettersToState(state.kio, KioGetter)
}))(ResourceDetailHandler);

class ScopeDetailHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        const {resourceId, scopeId} = this.props.params,
              app = this.props.kioStore.getApplication(getApplicationFromResource(resourceId)),
              scope = this.props.essentialsStore.getScope(resourceId, scopeId),
              resource = this.props.essentialsStore.getResource(resourceId),
              scopeApps = this.props.essentialsStore.getScopeApplications(resourceId, scopeId),
              userAccounts = this.props.userStore.getUserCloudAccounts().map(a => a.name),
              whitelisted = this.props.userStore.isWhitelisted(),
              canEdit = isWhitelistedOrOwner(userAccounts, app, whitelisted);
        return <ScopeDetail
                    resourceId={this.props.params.resourceId}
                    scopeId={this.props.params.scopeId}
                    canEdit={canEdit}
                    scope={scope}
                    resource={resource}
                    scopeApps={scopeApps} />
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
    KIO_ACTIONS.fetchApplication(getApplicationFromResource(resourceId));
};
let ConnectedScopeDetailHandler = connect(state => ({
    essentialsStore: bindGettersToState(state.essentials, EssentialsGetter),
    userStore: bindGettersToState(state.user, UserGetter),
    kioStore: bindGettersToState(state.kio, KioGetter)
}))(ScopeDetailHandler);

class EditScopeFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        const {resourceId, scopeId} = this.props.params,
              scope = this.props.essentialsStore.getScope(resourceId, scopeId),
              resource = this.props.essentialsStore.getResource(resourceId);
        return <ScopeForm
                    resourceId={this.props.params.resourceId}
                    scopeId={this.props.params.scopeId}
                    scope={scope}
                    edit={true}
                    resource={resource}
                    notificationActions={NOTIFICATION_ACTIONS}
                    essentialsActions={ESSENTIALS_ACTIONS} />;
    }
}
EditScopeFormHandler.isAllowed = function(routerState, state, [token, , app]) {
    return requireWhitelistedOrOwner(state, token, app);
};
EditScopeFormHandler.displayName = 'EditScopeFormHandler';
EditScopeFormHandler.propTypes = {
    params: React.PropTypes.object
};
EditScopeFormHandler.fetchData = function(routerState, state) {
    const {resourceId, scopeId} = routerState.params,
          app = getApplicationFromResource(resourceId),
          appPromise = app ? KIO_ACTIONS.fetchApplication(app).catch(e => undefined) : Promise.resolve();
    ESSENTIALS_ACTIONS.fetchResource(resourceId);
    return Promise.all([
        requireToken(state, USER_ACTIONS),
        ESSENTIALS_ACTIONS.fetchScope(resourceId, scopeId),
        appPromise
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
        const {resourceId, scopeId} = this.props.params,
              resource = this.props.essentialsStore.getResource(resourceId),
              existingScopeIds = this.props.essentialsStore.getScopes(resourceId).map(s => s.id);
        return <ScopeForm
                    resourceId={resourceId}
                    scopeId={scopeId}
                    resource={resource}
                    edit={false}
                    existingScopeIds={existingScopeIds}
                    notificationActions={NOTIFICATION_ACTIONS}
                    essentialsActions={ESSENTIALS_ACTIONS} />;
    }
}
CreateScopeFormHandler.isAllowed = function(routerState, state, [token, , app]) {
    return requireWhitelistedOrOwner(state, token, app);
};
CreateScopeFormHandler.displayName = 'CreateScopeFormHandler';
CreateScopeFormHandler.propTypes = {
    params: React.PropTypes.object
};
CreateScopeFormHandler.fetchData = function(routerState, state) {
    const {resourceId} = routerState.params,
          app = getApplicationFromResource(resourceId),
          appPromise = app ? KIO_ACTIONS.fetchApplication(app).catch(e => undefined) : Promise.resolve();
    ESSENTIALS_ACTIONS.fetchResource(resourceId);
    return Promise.all([
        requireToken(state, USER_ACTIONS),
        ESSENTIALS_ACTIONS.fetchScopes(resourceId),
        appPromise
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
