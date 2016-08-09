import React from 'react';
import {Route, IndexRoute} from 'react-router';

import REDUX from 'yourturn/src/redux';
import {connect} from 'react-redux';
import {
    bindGettersToState,
    bindActionsToStore
} from 'common/src/util';
import {
    wrapEnter,
    requireAccounts,
    requireAuth
} from 'common/src/router-utils';
import {getApplicationFromResource} from 'resource/src/util';

import * as UserGetter from 'common/src/data/user/user-getter';
import * as KioGetter from 'common/src/data/kio/kio-getter';
import * as EssentialsGetter from 'common/src/data/essentials/essentials-getter';
import * as MagnificentGetter from 'common/src/data/magnificent/magnificent-getter';

import * as NotificationActions from 'common/src/data/notification/notification-actions';
import * as UserActions from 'common/src/data/user/user-actions';
import * as EssentialsActions from 'common/src/data/essentials/essentials-actions';
import * as KioActions from 'common/src/data/kio/kio-actions';
import * as MagnificentActions from 'common/src/data/magnificent/magnificent-actions';

import ResourceForm from './resource-form/resource-form.jsx';
import ResourceList from './resource-list/resource-list.jsx';
import ResourceDetail from './resource-detail/resource-detail.jsx';
import ScopeDetail from './scope-detail/scope-detail.jsx';
import ScopeForm from './scope-form/scope-form.jsx';

const USER_ACTIONS = bindActionsToStore(REDUX, UserActions),
      ESSENTIALS_ACTIONS = bindActionsToStore(REDUX, EssentialsActions),
      NOTIFICATION_ACTIONS = bindActionsToStore(REDUX, NotificationActions),
      KIO_ACTIONS = bindActionsToStore(REDUX, KioActions),
      MAGNIFICENT_ACTIONS = bindActionsToStore(REDUX, MagnificentActions);

function requireToken(state, UserActions) {
    let tokeninfo = UserGetter.getTokenInfo(state.user);
    if (!tokeninfo.uid) {
        return UserActions.fetchTokenInfo();
    }
    return Promise.resolve(tokeninfo);
}

function requireWhitelistedOrOwner(token, auth) {
    const whitelisted = UserGetter.isTokenWhitelisted(token);
    if (!(whitelisted || !!auth)) {
        let error = new Error();
        error.name = 'Not allowed';
        error.message = 'You are not allowed to view this page. Sorry!';
        error.status = 'u1F62D';
        return error;
    }
    return true;
}

const CreateResourceFormHandler = (props) => {
    const existingResourceIds = props.essentialsStore.getResources().map(r => r.id),
          whitelisted = props.userStore.isWhitelisted();
    return <ResourceForm
                edit={false}
                essentialsActions={ESSENTIALS_ACTIONS}
                notificationActions={ESSENTIALS_ACTIONS}
                kioActions={KIO_ACTIONS}
                magnificentActions={MAGNIFICENT_ACTIONS}
                isUserWhitelisted={whitelisted}
                existingResourceIds={existingResourceIds} />;
};
CreateResourceFormHandler.displayName = 'CreateResourceFormHandler';
CreateResourceFormHandler.propTypes = {
    essentialsStore: React.PropTypes.shape({
        getResources: React.PropTypes.func
    }).isRequired,
    params: React.PropTypes.object,
    userStore: React.PropTypes.shape({
        isWhitelisted: React.PropTypes.func
    }).isRequired
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


const EditResourceFormHandler = (props) => {
    const resource = props.essentialsStore.getResource(this.props.params.resourceId);
    return <ResourceForm
                resourceId={props.params.resourceId}
                edit={true}
                notificationActions={NOTIFICATION_ACTIONS}
                essentialsActions={ESSENTIALS_ACTIONS}
                resource={resource} />;
};
EditResourceFormHandler.isAllowed = function(routerState, state, [token, auth]) {
    return requireWhitelistedOrOwner(token, auth);
};
EditResourceFormHandler.displayName = 'EditResourceFormHandler';
EditResourceFormHandler.propTypes = {
    essentialsStore: React.PropTypes.shape({
        getResource: React.PropTypes.func
    }).isRequired,
    params: React.PropTypes.object
};
EditResourceFormHandler.fetchData = function(routerState, state) {
    const app = getApplicationFromResource(routerState.params.resourceId),
          // we have to catch here as otherwise the route component is not displayed at all and the
          // app might not exist
          appPromise = app ? KIO_ACTIONS.fetchApplication(app).catch(() => undefined) : Promise.resolve();
    return appPromise.then(app => Promise.all([
        requireToken(state, USER_ACTIONS),
        app ? requireAuth(state, app.team_id, MAGNIFICENT_ACTIONS) : Promise.resolve(null),
        ESSENTIALS_ACTIONS.fetchResource(routerState.params.resourceId)
    ]));
};
let ConnectedEditResourceFormHandler = connect(state => ({
    essentialsStore: bindGettersToState(state.essentials, EssentialsGetter)
}))(EditResourceFormHandler);


const ResourceListHandler = (props) => {
    const resources = props.essentialsStore.getResources();
    return <ResourceList resources={resources} />;
};
ResourceListHandler.displayName = 'ResourceListHandler';
ResourceListHandler.propTypes = {
    essentialsStore: React.PropTypes.shape({
        getResources: React.PropTypes.func
    }).isRequired,
    params: React.PropTypes.object
};
ResourceListHandler.fetchData = function() {
    ESSENTIALS_ACTIONS.fetchResources();
};
let ConnectedResourceListHandler = connect(state => ({
    essentialsStore: bindGettersToState(state.essentials, EssentialsGetter)
}))(ResourceListHandler);

const ResourceDetailHandler = (props) => {
    const {resourceId} = props.params,
          application = props.kioStore.getApplication(getApplicationFromResource(resourceId)),
          resource = props.essentialsStore.getResource(resourceId),
          scopes = props.essentialsStore.getScopes(resourceId),
          whitelisted = props.userStore.isWhitelisted(),
          permitted = props.magnificentStore.getAuth(application.team_id),
          canEdit = whitelisted || permitted;
    return <ResourceDetail
                resource={resource}
                canEdit={canEdit}
                scopes={scopes}
                resourceId={resourceId} />;
};
ResourceDetailHandler.displayName = 'ResourceDetailHandler';
ResourceDetailHandler.propTypes = {
    essentialsStore: React.PropTypes.shape({
        getResource: React.PropTypes.func,
        getScopes: React.PropTypes.func
    }).isRequired,
    kioStore: React.PropTypes.shape({
        getApplication: React.PropTypes.func
    }).isRequired,
    magnificentStore: React.PropTypes.shape({
        getAuth: React.PropTypes.func
    }).isRequired,
    params: React.PropTypes.object,
    userStore: React.PropTypes.shape({
        isWhitelisted: React.PropTypes.func
    }).isRequired
};
ResourceDetailHandler.fetchData = function(routerState, state) {
    ESSENTIALS_ACTIONS.fetchResource(routerState.params.resourceId);
    ESSENTIALS_ACTIONS.fetchScopes(routerState.params.resourceId);
    const appId = getApplicationFromResource(routerState.params.resourceId),
          appPromise = appId ? KIO_ACTIONS.fetchApplication(appId) : Promise.resolve();
    appPromise
        .then(app => app ?
            requireAuth(state, app.team_id, MAGNIFICENT_ACTIONS) :
            Promise.resolve(null));
};
let ConnectedResourceDetailHandler = connect(state => ({
    essentialsStore: bindGettersToState(state.essentials, EssentialsGetter),
    userStore: bindGettersToState(state.user, UserGetter),
    kioStore: bindGettersToState(state.kio, KioGetter),
    magnificentStore: bindGettersToState(state.magnificent, MagnificentGetter)
}))(ResourceDetailHandler);

const ScopeDetailHandler = (props) => {
    const {resourceId, scopeId} = props.params,
          application = props.kioStore.getApplication(getApplicationFromResource(resourceId)),
          scope = props.essentialsStore.getScope(resourceId, scopeId),
          resource = props.essentialsStore.getResource(resourceId),
          scopeApps = props.essentialsStore.getScopeApplications(resourceId, scopeId),
          whitelisted = props.userStore.isWhitelisted(),
          permitted = props.magnificentStore.getAuth(application.team_id),
          canEdit = whitelisted || permitted;
    return <ScopeDetail
                resourceId={this.props.params.resourceId}
                scopeId={this.props.params.scopeId}
                canEdit={canEdit}
                scope={scope}
                resource={resource}
                scopeApps={scopeApps} />
};
ScopeDetailHandler.displayName = 'ScopeDetailHandler';
ScopeDetailHandler.propTypes = {
    essentialsStore: React.PropTypes.shape({
        getResource: React.PropTypes.func,
        getScope: React.PropTypes.func,
        getScopeApplications: React.PropTypes.func
    }).isRequired,
    kioStore: React.PropTypes.shape({
        getApplication: React.PropTypes.func
    }).isRequired,
    magnificentStore: React.PropTypes.shape({
        getAuth: React.PropTypes.func
    }).isRequired,
    params: React.PropTypes.object,
    userStore: React.PropTypes.shape({
        isWhitelisted: React.PropTypes.func
    }).isRequired
};
ScopeDetailHandler.fetchData = function(routerState, state) {
    let {resourceId, scopeId} = routerState.params;
    ESSENTIALS_ACTIONS.fetchResource(resourceId);
    ESSENTIALS_ACTIONS.fetchScope(resourceId, scopeId);
    ESSENTIALS_ACTIONS.fetchScopeApplications(resourceId, scopeId);
    KIO_ACTIONS.fetchApplication(getApplicationFromResource(resourceId))
        .then(({team_id}) => requireAuth(state, team_id, MAGNIFICENT_ACTIONS));
};
let ConnectedScopeDetailHandler = connect(state => ({
    essentialsStore: bindGettersToState(state.essentials, EssentialsGetter),
    userStore: bindGettersToState(state.user, UserGetter),
    kioStore: bindGettersToState(state.kio, KioGetter),
    magnificentStore: bindGettersToState(state.magnificent, MagnificentGetter)
}))(ScopeDetailHandler);

const EditScopeFormHandler = (props) => {
    const {resourceId, scopeId} = props.params,
          scope = props.essentialsStore.getScope(resourceId, scopeId),
          resource = props.essentialsStore.getResource(resourceId);
    return <ScopeForm
                resourceId={this.props.params.resourceId}
                scopeId={this.props.params.scopeId}
                scope={scope}
                edit={true}
                resource={resource}
                notificationActions={NOTIFICATION_ACTIONS}
                essentialsActions={ESSENTIALS_ACTIONS} />;
};
EditScopeFormHandler.isAllowed = function(routerState, state, [token, auth]) {
    return requireWhitelistedOrOwner(token, auth);
};
EditScopeFormHandler.displayName = 'EditScopeFormHandler';
EditScopeFormHandler.propTypes = {
    essentialsStore: React.PropTypes.shape({
        getResource: React.PropTypes.func,
        getScope: React.PropTypes.func
    }).isRequired,
    params: React.PropTypes.object
};
EditScopeFormHandler.fetchData = function(routerState, state) {
    const {resourceId, scopeId} = routerState.params,
          app = getApplicationFromResource(resourceId),
          appPromise = app ? KIO_ACTIONS.fetchApplication(app).catch(() => undefined) : Promise.resolve();
    ESSENTIALS_ACTIONS.fetchResource(resourceId);
    return appPromise.then(app => Promise.all([
        requireToken(state, USER_ACTIONS),
        app ? requireAuth(state, app.team_id, MAGNIFICENT_ACTIONS) : Promise.resolve(null),
        ESSENTIALS_ACTIONS.fetchScope(resourceId, scopeId)
    ]))
};
let ConnectedEditScopeFormHandler = connect(state => ({
    essentialsStore: bindGettersToState(state.essentials, EssentialsGetter)
}))(EditScopeFormHandler);

const CreateScopeFormHandler = (props) => {
    const {resourceId, scopeId} = props.params,
          resource = props.essentialsStore.getResource(resourceId),
          existingScopeIds = props.essentialsStore.getScopes(resourceId).map(s => s.id);
    return <ScopeForm
                resourceId={resourceId}
                scopeId={scopeId}
                resource={resource}
                edit={false}
                existingScopeIds={existingScopeIds}
                notificationActions={NOTIFICATION_ACTIONS}
                essentialsActions={ESSENTIALS_ACTIONS} />;
};
CreateScopeFormHandler.isAllowed = function(routerState, state, [token, auth]) {
    return requireWhitelistedOrOwner(token, auth);
};
CreateScopeFormHandler.displayName = 'CreateScopeFormHandler';
CreateScopeFormHandler.propTypes = {
    essentialsStore: React.PropTypes.shape({
        getResource: React.PropTypes.func,
        getScopes: React.PropTypes.func
    }).isRequired,
    params: React.PropTypes.object
};
CreateScopeFormHandler.fetchData = function(routerState, state) {
    const {resourceId} = routerState.params,
          app = getApplicationFromResource(resourceId),
          appPromise = app ? KIO_ACTIONS.fetchApplication(app).catch(() => undefined) : Promise.resolve();
    ESSENTIALS_ACTIONS.fetchResource(resourceId);
    return appPromise.then(app => Promise.all([
        requireToken(state, USER_ACTIONS),
        app ? requireAuth(state, app.team_id, MAGNIFICENT_ACTIONS) : Promise.resolve(null),
        ESSENTIALS_ACTIONS.fetchScopes(resourceId)
    ]));
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
