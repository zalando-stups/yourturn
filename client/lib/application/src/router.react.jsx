/* global ENV_DEVELOPMENT */
import _ from 'lodash';
import React from 'react';
import {Route, IndexRoute} from 'react-router';
import REDUX from 'yourturn/src/redux';
import {
    bindGettersToState,
    bindActionsToStore
} from 'common/src/util';
import {
    wrapEnter,
    requireAccounts,
    requireAuth,
    requireTeams
} from 'common/src/router-utils';
import {connect} from 'react-redux';

import * as KioGetter from 'common/src/data/kio/kio-getter';
import * as UserGetter from 'common/src/data/user/user-getter';
import * as TeamGetter from 'common/src/data/team/team-getter';
import * as TwintipGetter from 'common/src/data/twintip/twintip-getter';
import * as MintGetter from 'common/src/data/mint/mint-getter';
import * as EssentialsGetter from 'common/src/data/essentials/essentials-getter';
import * as ClustersGetter from 'common/src/data/clusters/clusters-getter';
import * as MagnificentGetter from 'common/src/data/magnificent/magnificent-getter';

import * as NotificationActions from 'common/src/data/notification/notification-actions';
import * as KioActions from 'common/src/data/kio/kio-actions';
import * as UserActions from 'common/src/data/user/user-actions';
import * as TeamActions from 'common/src/data/team/team-actions';
import * as TwintipActions from 'common/src/data/twintip/twintip-actions';
import * as MintActions from 'common/src/data/mint/mint-actions';
import * as EssentialsActions from 'common/src/data/essentials/essentials-actions';
import * as ClustersActions from 'common/src/data/clusters/clusters-actions';
import * as MagnificentActions from 'common/src/data/magnificent/magnificent-actions';

import ApplicationList from './application-list/application-list.jsx';
import ApplicationForm from './application-form/application-form.jsx';
import ApplicationDetail from './application-detail/application-detail.jsx';
import OAuthForm from './oauth-form/oauth-form.jsx';
import AccessForm from './access-form/access-form.jsx';
import { ConnectedApplicationLifecycleHandler } from './application-lifecycle/ApplicationLifeCycleComponent.jsx';

import {appList} from 'application/src/routes';

const MINT_ACTIONS = bindActionsToStore(REDUX, MintActions),
      USER_ACTIONS = bindActionsToStore(REDUX, UserActions),
      KIO_ACTIONS = bindActionsToStore(REDUX, KioActions),
      ESSENTIALS_ACTIONS = bindActionsToStore(REDUX, EssentialsActions),
      CLUSTERS_ACTIONS = bindActionsToStore(REDUX, ClustersActions),
      NOTIFICATION_ACTIONS = bindActionsToStore(REDUX, NotificationActions),
      TEAM_ACTIONS = bindActionsToStore(REDUX, TeamActions),
      TWINTIP_ACTIONS = bindActionsToStore(REDUX, TwintipActions),
      MAGNIFICENT_ACTIONS = bindActionsToStore(REDUX, MagnificentActions);

class AppListHandler extends React.Component {
    constructor() {
        super();
    }

    checkForTeam(props) {
        const {team, manageTabs} = props.location.query,
              tabAccounts = props.kioStore.getTabAccounts(),
              cloudAccounts = props.userStore.getUserCloudAccounts().map(a => a.name),
              preferredAccount = props.kioStore.getPreferredAccount();

        if (!tabAccounts.length) {
            // no tab accounts => use cloud accounts, do nothing
            KIO_ACTIONS.saveTabAccounts(cloudAccounts.sort());
            return;
        }
        if (team && tabAccounts.indexOf(team) === -1) {
            // there is a team, but not in tab accounts => add it
            KIO_ACTIONS.saveTabAccounts(_.unique(tabAccounts.concat([team])).sort());
            return;
        }
        if (!(team || manageTabs) && preferredAccount) {
            // no team, no manageTabs => redirect to preferred account
            // make sure team is in tabs
            this.context.router.replace({
                pathname: appList(),
                query: {
                    team: preferredAccount || team
                }
            });
        }
    }

    componentWillMount() {
        this.checkForTeam(this.props);
        const {team, manageTabs} = this.props.location.query;
        if (manageTabs) {
            TEAM_ACTIONS.fetchAccounts();
        }
        if (team) {
            KIO_ACTIONS.fetchApplications(team);
        }
        if (!manageTabs && !team) {
            TEAM_ACTIONS.fetchAccounts();
        }
    }

    componentWillReceiveProps(nextProps) {
        this.checkForTeam(nextProps);
        const {team, manageTabs} = nextProps.location.query;
        if (team && team !== this.props.location.query.team) {
            KIO_ACTIONS.fetchApplications(team);
        }
        if (manageTabs && manageTabs !== this.props.location.query.manageTabs) {
            // manage tabs => fetch all accounts
            TEAM_ACTIONS.fetchAccounts();
            return;
        }
    }

    onChangeTab(team) {
        const query = {};
        if (team) {
            query.team = team;
        } else {
            query.manageTabs = true;
        }
        this.context.router.push({
            pathname: appList(),
            query
        });
    }

    render() {
        const accounts = this.props.teamStore.getAccounts().map(a => a.name),
              teams = this.props.teamStore.getTeams().map(t => t.id),
              accountsAndTeams = [...new Set(accounts.concat(teams))].sort(),
              selectedTab = this.props.location.query.team,
              applicationsFetching = this.props.kioStore.getApplicationsFetchStatus(),
              tabAccounts = this.props.kioStore.getTabAccounts();
        return <ApplicationList
                    kioActions={KIO_ACTIONS}
                    tabAccounts={tabAccounts}
                    selectedTab={selectedTab}
                    applicationsFetching={applicationsFetching}
                    accounts={accountsAndTeams}
                    onChangeTab={this.onChangeTab.bind(this)}
                    {...this.props} />;
    }
}
AppListHandler.displayName = 'AppListHandler';
AppListHandler.propTypes = {
    kioStore: React.PropTypes.shape({
        getApplicationsFetchStatus: React.PropTypes.func,
        getTabAccounts: React.PropTypes.func
    }).isRequired,
    location: React.PropTypes.shape({
        query: React.PropTypes.shape({
            team: React.PropTypes.string,
            manageTabs: React.PropTypes.any // TODO
        })
    }).isRequired,
    teamStore: React.PropTypes.shape({
        getAccounts: React.PropTypes.func,
        getTeams: React.PropTypes.func
    }).isRequired
};
AppListHandler.contextTypes = {
    router: React.PropTypes.object
};
AppListHandler.fetchData = function(routerState, state) {
    // we need to know which accounts a user has access to
    KIO_ACTIONS.loadTabAccounts();
    requireAccounts(state, USER_ACTIONS);
    requireTeams(state, USER_ACTIONS);
    TEAM_ACTIONS.fetchAccounts();
    TEAM_ACTIONS.fetchTeams();
};
var ConnectedAppListHandler =
        connect(state => ({
            kioStore: bindGettersToState(state.kio, KioGetter),
            teamStore: bindGettersToState(state.team, TeamGetter),
            userStore: bindGettersToState(state.user, UserGetter)
        }))(AppListHandler);

const CreateAppFormHandler = (props) => {
    const userTeams = props.userStore
                        .getUserTeams()
                        .map(t => t.id),
        userAccounts = props.userStore
                        .getUserCloudAccounts()
                        .map(acc => acc.owner),
        availableTeams = [...new Set([...userTeams, ...userAccounts])].sort(),
        applicationIds = props.kioStore.getApplications().map(a => a.id);
    return  <ApplicationForm
                edit={false}
                userTeams={availableTeams}
                applicationIds={applicationIds}
                notificationActions={NOTIFICATION_ACTIONS}
                kioActions={KIO_ACTIONS} />;
};
CreateAppFormHandler.displayName = 'CreateAppFormHandler';
CreateAppFormHandler.propTypes = {
    kioStore: React.PropTypes.shape({
        getApplications: React.PropTypes.func
    }).isRequired,
    params: React.PropTypes.object.isRequired,
    userStore: React.PropTypes.shape({
        getUserTeams: React.PropTypes.func,
        getUserCloudAccounts: React.PropTypes.func
    }).isRequired
};
CreateAppFormHandler.fetchData = function(routerState, state) {
    return Promise.all([
        requireTeams(state, USER_ACTIONS),
        KIO_ACTIONS.fetchApplications()
    ]);
};
var ConnectedCreateAppFormHandler =
    connect(state => ({
        kioStore: bindGettersToState(state.kio, KioGetter),
        userStore: bindGettersToState(state.user, UserGetter)
    }))(CreateAppFormHandler);

const EditAppFormHandler = (props) => {
    const {applicationId} = props.params,
          application = props.kioStore.getApplication(applicationId),
          userTeams = props.userStore.
                        getUserTeams()
                        .map(t => t.id),
          userAccounts = props.userStore
                        .getUserCloudAccounts()
                        .map(acc => acc.owner),
          availableTeams = [...new Set([...userTeams, ...userAccounts])].sort(),
          teamsAndPreviousValue = new Set([...availableTeams, application.team_id]),
          applicationIds = props.kioStore.getApplications().map(a => a.id);

    return <ApplicationForm
                edit={true}
                applicationId={applicationId}
                notificationActions={NOTIFICATION_ACTIONS}
                kioActions={KIO_ACTIONS}
                application={application}
                applicationIds={applicationIds}
                userTeams={[...teamsAndPreviousValue].sort()} />
};
EditAppFormHandler.isAllowed = function(routerState, state, [hasAuth]) {
    if (!hasAuth) {
        let error = new Error();
        error.name = 'Forbidden';
        error.message = 'You can only edit your own applications!';
        error.status = 'u1F62D';
        return error;
    }
};
EditAppFormHandler.displayName = 'EditAppFormHandler';
EditAppFormHandler.propTypes = {
    kioStore: React.PropTypes.shape({
        getApplication: React.PropTypes.func,
        getApplications: React.PropTypes.func
    }).isRequired,
    params: React.PropTypes.object.isRequired,
    userStore: React.PropTypes.shape({
        getUserTeams: React.PropTypes.func,
        getUserCloudAccounts: React.PropTypes.func
    }).isRequired
};
EditAppFormHandler.fetchData = function(routerState, state) {
    return KIO_ACTIONS.fetchApplication(routerState.params.applicationId)
        .then(app => Promise.all([
            requireAuth(state, app.team_id, MAGNIFICENT_ACTIONS),
            requireTeams(state, USER_ACTIONS)
        ]));
};
var ConnectedEditAppFormHandler =
    connect(state => ({
        kioStore: bindGettersToState(state.kio, KioGetter),
        userStore: bindGettersToState(state.user, UserGetter)
    }))(EditAppFormHandler);

const AppDetailHandler = (props) => {
    const   {applicationId} = props.params,
            app = props.kioStore.getApplication(applicationId),
            api = props.twintipStore.getApi(applicationId),
            editable = !!props.magnificentStore.getAuth(app.team_id);
    return <ApplicationDetail
                applicationId={props.params.applicationId}
                application={app}
                editable={editable}
                api={api}
                kioActions={KIO_ACTIONS}
                notificationActions={NOTIFICATION_ACTIONS} />;
};
AppDetailHandler.displayName = 'AppDetailHandler';
AppDetailHandler.propTypes = {
    kioStore: React.PropTypes.shape({
        getApplication: React.PropTypes.func
    }).isRequired,
    magnificentStore: React.PropTypes.shape({
        getAuth: React.PropTypes.func
    }).isRequired,
    params: React.PropTypes.object.isRequired,
    twintipStore: React.PropTypes.shape({
        getApi: React.PropTypes.func
    }).isRequired
};
AppDetailHandler.fetchData = function(routerState, state) {
    const {applicationId} = routerState.params;
    TWINTIP_ACTIONS.fetchApi(applicationId);
    KIO_ACTIONS
        .fetchApplication(applicationId)
        .then(({team_id}) => requireAuth(state, team_id, MAGNIFICENT_ACTIONS));
};
var ConnectedAppDetailHandler =
    connect(state => ({
        kioStore: bindGettersToState(state.kio, KioGetter),
        userStore: bindGettersToState(state.user, UserGetter),
        twintipStore: bindGettersToState(state.twintip, TwintipGetter),
        magnificentStore: bindGettersToState(state.magnificent, MagnificentGetter)
    }))(AppDetailHandler);

const OAuthFormHandler = (props) => {
    const  {applicationId} = props.params,
           {kioStore, magnificentStore, essentialsStore, mintStore} = props,
           application = kioStore.getApplication(applicationId),
           editable = magnificentStore.getAuth(application.team_id),
           oauthConfig = mintStore.getOAuthConfig(applicationId),
           allScopes = essentialsStore.getAllScopes(),
           resourceOwnerScopes = allScopes.filter(s => s.is_resource_owner_scope);
    return <OAuthForm
                applicationId={applicationId}
                editable={editable}
                application={application}
                allScopes={allScopes}
                resourceOwnerScopes={resourceOwnerScopes}
                oauthConfig={oauthConfig}
                mintActions={MINT_ACTIONS}
                notificationActions={NOTIFICATION_ACTIONS} />;
};
OAuthFormHandler.displayName = 'OAuthFormHandler';
OAuthFormHandler.propTypes = {
    essentialsStore: React.PropTypes.shape({
        getAllScopes: React.PropTypes.func
    }).isRequired,
    kioStore: React.PropTypes.shape({
        getApplication: React.PropTypes.func
    }).isRequired,
    magnificentStore: React.PropTypes.shape({
        getAuth: React.PropTypes.func
    }).isRequired,
    mintStore: React.PropTypes.shape({
        getOAuthConfig: React.PropTypes.func
    }).isRequired,
    params: React.PropTypes.object.isRequired
};
OAuthFormHandler.fetchData = function(routerState, state) {
    const id = routerState.params.applicationId,
          app = KioGetter.getApplication(state.kio, id);
    ESSENTIALS_ACTIONS.fetchAllScopes();
    if (!app) {
        KIO_ACTIONS.fetchApplication(id)
            .then(({team_id}) => requireAuth(state, team_id, MAGNIFICENT_ACTIONS))
    } else {
        requireAuth(state, app.team_id, MAGNIFICENT_ACTIONS);
    }
    return MINT_ACTIONS.fetchOAuthConfig(id);
};
let ConnectedOAuthFormHandler = connect(state => ({
    kioStore: bindGettersToState(state.kio, KioGetter),
    mintStore: bindGettersToState(state.mint, MintGetter),
    userStore: bindGettersToState(state.user, UserGetter),
    essentialsStore: bindGettersToState(state.essentials, EssentialsGetter),
    clustersStore: bindGettersToState(state.kuibernetes_clusters, ClustersGetter),
    magnificentStore: bindGettersToState(state.magnificent, MagnificentGetter)
}))(OAuthFormHandler);

const AccessFormHandler = (props) => {
    const {applicationId} = props.params,
        {magnificentStore, kioStore, mintStore, essentialsStore, clustersStore, userStore} = props,
        application = kioStore.getApplication(applicationId),
        oauthConfig = mintStore.getOAuthConfig(applicationId),
        cloudAccounts = userStore.getUserCloudAccounts(),
        defaultAccount = cloudAccounts.length ? cloudAccounts[0].id : false,
        allScopes = essentialsStore.getAllScopes(),
        allClusters = clustersStore.getAllClusters(),
        kubernetesClusters = allClusters,
        applicationScopes = allScopes.filter(s => !s.is_resource_owner_scope),
        editable = magnificentStore.getAuth(application.team_id);
    return <AccessForm
            applicationId={props.params.applicationId}
            editable={editable}
            oauthConfig={oauthConfig}
            mintActions={MINT_ACTIONS}
            defaultAccount={defaultAccount}
            applicationScopes={applicationScopes}
            kubernetesClusters={kubernetesClusters}
            notificationActions={NOTIFICATION_ACTIONS}
            application={application}
            allClusters={allClusters}
            allScopes={allScopes} />;
};
AccessFormHandler.displayName = 'AccessFormHandler';
AccessFormHandler.propTypes = {
    clustersStore: React.PropTypes.shape({
        getAllClusters: React.PropTypes.func
    }).isRequired,
    essentialsStore: React.PropTypes.shape({
        getAllScopes: React.PropTypes.func
    }).isRequired,
    kioStore: React.PropTypes.shape({
        getApplication: React.PropTypes.func
    }).isRequired,
    magnificentStore: React.PropTypes.shape({
        getAuth: React.PropTypes.func
    }).isRequired,
    mintStore: React.PropTypes.shape({
        getOAuthConfig: React.PropTypes.func
    }).isRequired,
    params: React.PropTypes.object.isRequired,
    userStore: React.PropTypes.shape({
        getUserCloudAccounts: React.PropTypes.func
    }).isRequired
};
AccessFormHandler.fetchData = function(routerState, state) {
    let id = routerState.params.applicationId;
    ESSENTIALS_ACTIONS.fetchAllScopes();
    CLUSTERS_ACTIONS.fetchAllClusters();
    const application = KioGetter.getApplication(state.kio, id);
    if (!application) {
        KIO_ACTIONS
            .fetchApplication(id)
            .then(({team_id}) => requireAuth(state, team_id, MAGNIFICENT_ACTIONS));
    } else {
        requireAuth(state, application.team_id, MAGNIFICENT_ACTIONS)
    }
    requireAccounts(state, USER_ACTIONS);
    return MINT_ACTIONS.fetchOAuthConfig(id);
};
let ConnectedAccessFormHandler = connect(state => ({
    mintStore: bindGettersToState(state.mint, MintGetter),
    kioStore: bindGettersToState(state.kio, KioGetter),
    userStore: bindGettersToState(state.user, UserGetter),
    essentialsStore: bindGettersToState(state.essentials, EssentialsGetter),
    clustersStore: bindGettersToState(state.kubernetes_clusters, ClustersGetter),
    magnificentStore: bindGettersToState(state.magnificent, MagnificentGetter)
}))(AccessFormHandler);

const ROUTES =
        <Route path='application'>
            <IndexRoute
                onEnter={wrapEnter(AppListHandler.fetchData)}
                component={ConnectedAppListHandler} />
            <Route
                path='create'
                onEnter={wrapEnter(CreateAppFormHandler.fetchData)}
                component={ConnectedCreateAppFormHandler} />
            <Route
                path='edit/:applicationId'
                onEnter={wrapEnter(EditAppFormHandler.fetchData, EditAppFormHandler.isAllowed)}
                component={ConnectedEditAppFormHandler} />
            <Route
                path='oauth/:applicationId'
                onEnter={wrapEnter(OAuthFormHandler.fetchData, OAuthFormHandler.isAllowed)}
                component={ConnectedOAuthFormHandler} />
            <Route
                path='access-control/:applicationId'
                onEnter={wrapEnter(AccessFormHandler.fetchData, AccessFormHandler.isAllowed)}
                component={ConnectedAccessFormHandler} />
            <Route
                path='detail/:applicationId'>
                <IndexRoute
                    onEnter={wrapEnter(AppDetailHandler.fetchData)}
                    component={ConnectedAppDetailHandler} />
                {ENV_DEVELOPMENT ?
                    <Route path='lifecycle'>
                        <IndexRoute
                            component={ConnectedApplicationLifecycleHandler} />
                    </Route>
                    : null
                }
            </Route>
        </Route>;

export default ROUTES;
