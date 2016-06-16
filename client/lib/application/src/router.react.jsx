import _ from 'lodash';
import React from 'react';
import {Route, IndexRoute} from 'react-router';
import {parseArtifact} from 'application/src/util';
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
import * as PieroneGetter from 'common/src/data/pierone/pierone-getter';
import * as TwintipGetter from 'common/src/data/twintip/twintip-getter';
import * as MintGetter from 'common/src/data/mint/mint-getter';
import * as EssentialsGetter from 'common/src/data/essentials/essentials-getter';
import * as MagnificentGetter from 'common/src/data/magnificent/magnificent-getter';

import * as NotificationActions from 'common/src/data/notification/notification-actions';
import * as KioActions from 'common/src/data/kio/kio-actions';
import * as UserActions from 'common/src/data/user/user-actions';
import * as TeamActions from 'common/src/data/team/team-actions';
import * as TwintipActions from 'common/src/data/twintip/twintip-actions';
import * as MintActions from 'common/src/data/mint/mint-actions';
import * as EssentialsActions from 'common/src/data/essentials/essentials-actions';
import * as PieroneActions from 'common/src/data/pierone/pierone-actions';
import * as MagnificentActions from 'common/src/data/magnificent/magnificent-actions';

import ApplicationList from './application-list/application-list.jsx';
import ApplicationForm from './application-form/application-form.jsx';
import ApplicationDetail from './application-detail/application-detail.jsx';
import OAuthForm from './oauth-form/oauth-form.jsx';
import AccessForm from './access-form/access-form.jsx';
import VersionList from './version-list/version-list.jsx';
import VersionForm from './version-form/version-form.jsx';
import VersionDetail from './version-detail/version-detail.jsx';
import ApprovalForm from './approval-form/approval-form.jsx';

import {appList} from 'application/src/routes';

const MINT_ACTIONS = bindActionsToStore(REDUX, MintActions),
      PIERONE_ACTIONS = bindActionsToStore(REDUX, PieroneActions),
      USER_ACTIONS = bindActionsToStore(REDUX, UserActions),
      KIO_ACTIONS = bindActionsToStore(REDUX, KioActions),
      ESSENTIALS_ACTIONS = bindActionsToStore(REDUX, EssentialsActions),
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
            KIO_ACTIONS.fetchLatestApplicationVersions(team);
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
            KIO_ACTIONS.fetchLatestApplicationVersions(team);
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

class CreateAppFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        const userTeams = this.props.userStore.getUserTeams();
        return  <ApplicationForm
                    edit={false}
                    userTeams={userTeams}
                    notificationActions={NOTIFICATION_ACTIONS}
                    kioActions={KIO_ACTIONS}
                    {...this.props} />;
    }
}
CreateAppFormHandler.displayName = 'CreateAppFormHandler';
CreateAppFormHandler.propTypes = {
    params: React.PropTypes.object.isRequired
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

class EditAppFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        const {applicationId} = this.props.params,
              userAccounts = this.props.userStore.getUserCloudAccounts().map(a => a.name),
              userTeams = this.props.userStore.getUserTeams().map(t => t.id),
              accountsAndTeams = new Set(userAccounts.concat(userTeams)),
              application = this.props.kioStore.getApplication(applicationId),
              applicationIds = this.props.kioStore.getApplications().map(a => a.id);

        return <ApplicationForm
                    edit={true}
                    applicationId={applicationId}
                    notificationActions={NOTIFICATION_ACTIONS}
                    kioActions={KIO_ACTIONS}
                    application={application}
                    applicationIds={applicationIds}
                    userTeams={[...accountsAndTeams]} />
    }
}
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
    params: React.PropTypes.object.isRequired
};
EditAppFormHandler.fetchData = function(routerState, state) {
    return KIO_ACTIONS.fetchApplication(routerState.params.applicationId)
        .then(app => Promise.all([
            requireAuth(state, app.team_id, MAGNIFICENT_ACTIONS),
            requireTeams(state, USER_ACTIONS),
            requireAccounts(state, USER_ACTIONS)
        ]));
};
var ConnectedEditAppFormHandler =
    connect(state => ({
        kioStore: bindGettersToState(state.kio, KioGetter),
        userStore: bindGettersToState(state.user, UserGetter)
    }))(EditAppFormHandler);

class AppDetailHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        const   {applicationId} = this.props.params,
                app = this.props.kioStore.getApplication(applicationId),
                api = this.props.twintipStore.getApi(applicationId),
                editable = !!this.props.magnificentStore.getAuth(app.team_id),
                versions = _.take(this.props.kioStore.getApplicationVersions(applicationId), 3);
        return <ApplicationDetail
                    applicationId={this.props.params.applicationId}
                    application={app}
                    versions={versions}
                    editable={editable}
                    api={api}
                    kioActions={KIO_ACTIONS}
                    notificationActions={NOTIFICATION_ACTIONS} />;
    }
}
AppDetailHandler.displayName = 'AppDetailHandler';
AppDetailHandler.propTypes = {
    params: React.PropTypes.object.isRequired
};
AppDetailHandler.fetchData = function(routerState, state) {
    const {applicationId} = routerState.params;
    KIO_ACTIONS.fetchApplicationVersions(applicationId);
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

class OAuthFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        const  {applicationId} = this.props.params,
               {kioStore, magnificentStore, essentialsStore, mintStore} = this.props,
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
    }
}
OAuthFormHandler.displayName = 'OAuthFormHandler';
OAuthFormHandler.propTypes = {
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
    magnificentStore: bindGettersToState(state.magnificent, MagnificentGetter)
}))(OAuthFormHandler);

class AccessFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        const {applicationId} = this.props.params,
            {magnificentStore, kioStore, mintStore, essentialsStore, userStore} = this.props,
            application = kioStore.getApplication(applicationId),
            oauthConfig = mintStore.getOAuthConfig(applicationId),
            cloudAccounts = userStore.getUserCloudAccounts(),
            defaultAccount = cloudAccounts.length ? cloudAccounts[0].id : false,
            allScopes = essentialsStore.getAllScopes(),
            applicationScopes = allScopes.filter(s => !s.is_resource_owner_scope),
            editable = magnificentStore.getAuth(application.team_id);
        return <AccessForm
                applicationId={this.props.params.applicationId}
                editable={editable}
                oauthConfig={oauthConfig}
                mintActions={MINT_ACTIONS}
                defaultAccount={defaultAccount}
                applicationScopes={applicationScopes}
                notificationActions={NOTIFICATION_ACTIONS}
                application={application} />;
    }
}
AccessFormHandler.displayName = 'AccessFormHandler';
AccessFormHandler.propTypes = {
    params: React.PropTypes.object.isRequired
};
AccessFormHandler.fetchData = function(routerState, state) {
    let id = routerState.params.applicationId;
    ESSENTIALS_ACTIONS.fetchAllScopes();
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
    magnificentStore: bindGettersToState(state.magnificent, MagnificentGetter)
}))(AccessFormHandler);

class VersionListHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <VersionList
                    applicationId={this.props.params.applicationId}
                    {...this.props} />;
    }
}
VersionListHandler.displayName = 'VersionListHandler';
VersionListHandler.propTypes = {
    params: React.PropTypes.object.isRequired
};
VersionListHandler.fetchData = function(routerState, state) {
    let id = routerState.params.applicationId;
    KIO_ACTIONS.fetchApplicationVersions(id);
    if (!KioGetter.getApplication(state.kio, id)) {
        KIO_ACTIONS.fetchApplication(id);
    }
};
let ConnectedVersionListHandler = connect(state => ({
    kioStore: bindGettersToState(state.kio, KioGetter),
    userStore: bindGettersToState(state.user, UserGetter)
}))(VersionListHandler);

class VersionDetailHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        const {applicationId, versionId} = this.props.params,
            {kioStore, magnificentStore, pieroneStore} = this.props,
            application = kioStore.getApplication(applicationId),
            version = kioStore.getApplicationVersion(applicationId, versionId),
            {team, artifact, tag} = parseArtifact(version.artifact),
            artifactInfo = {team, artifact, tag},
            tags = pieroneStore.getTags(team, artifact).map(t => t.name),
            approvalCount = kioStore.getApprovals(applicationId, versionId).length,
            editable = !!magnificentStore.getAuth(application.team_id),
            scmSource = pieroneStore.getScmSource(team, artifact, tag);;
        return <VersionDetail
                    applicationId={this.props.params.applicationId}
                    versionId={this.props.params.versionId}
                    application={application}
                    version={version}
                    editable={editable}
                    approvalCount={approvalCount}
                    scmSource={scmSource}
                    artifactInfo={artifactInfo}
                    tags={tags}
                    {...this.props} />;
    }
}
VersionDetailHandler.displayName = 'VersionDetailHandler';
VersionDetailHandler.propTypes = {
    params: React.PropTypes.object.isRequired
};
VersionDetailHandler.fetchData = function(routerState, state) {
    let {applicationId, versionId} = routerState.params;
    // fetch approvals for version
    KIO_ACTIONS.fetchApprovals(applicationId, versionId);
    // fetch version itself
    KIO_ACTIONS
        .fetchApplicationVersion(applicationId, versionId)
        .then(version => {
            // once it's there parse the artifact and fetch scm-source.json
            let {tag, team, artifact} = parseArtifact(version.artifact);
            PIERONE_ACTIONS.fetchScmSource(team, artifact, tag);
            PIERONE_ACTIONS.fetchTags(team, artifact);
        });
    // fetch the application if it's not there aleady
    const app = KioGetter.getApplication(state.kio, applicationId),
        appPromise = !app ? KIO_ACTIONS.fetchApplication(applicationId) : Promise.resolve(app);
    appPromise.then(({team_id}) => requireAuth(state, team_id, MAGNIFICENT_ACTIONS));
};
let ConnectedVersionDetailHandler = connect(state => ({
    kioStore: bindGettersToState(state.kio, KioGetter),
    userStore: bindGettersToState(state.user, UserGetter),
    pieroneStore: bindGettersToState(state.pierone, PieroneGetter),
    magnificentStore: bindGettersToState(state.magnificent, MagnificentGetter)
}))(VersionDetailHandler);

class CreateVersionFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        const {applicationId, versionId} = this.props.params,
            {kioStore} = this.props,
            application = kioStore.getApplication(applicationId),
            version = kioStore.getApplicationVersion(applicationId, versionId),
            approvalCount = kioStore.getApprovals(applicationId, versionId).length,
            versionIds = kioStore.getApplicationVersions(applicationId).map(v => v.id);
        return <VersionForm
                    edit={false}
                    applicationId={applicationId}
                    versionId={versionId}
                    application={application}
                    version={version}
                    versionIds={versionIds}
                    approvalCount={approvalCount}
                    kioActions={KIO_ACTIONS}
                    notificationActions={NOTIFICATION_ACTIONS} />;
    }
}
CreateVersionFormHandler.displayName = 'CreateVersionFormHandler';
CreateVersionFormHandler.propTypes = {
    params: React.PropTypes.object.isRequired
};
CreateVersionFormHandler.fetchData = function(routerState, state) {
    const {applicationId} = routerState.params,
          app = KioGetter.getApplication(state.kio, applicationId),
          appPromise = !!app ?
                            Promise.resolve(app) :
                            KIO_ACTIONS.fetchApplication(applicationId);
    return appPromise.then(({team_id}) => requireAuth(state, team_id, MAGNIFICENT_ACTIONS))
};
CreateVersionFormHandler.isAllowed = function(routerState, state, hasAuth) {
    if (!hasAuth) {
        let error = new Error();
        error.name = 'Forbidden';
        error.message = 'You can only add versions for your own applications!';
        error.status = 'u1F62D';
        return error;
    }
};
let ConnectedCreateVersionFormHandler = connect(state => ({
    kioStore: bindGettersToState(state.kio, KioGetter)
}))(CreateVersionFormHandler);

class EditVersionFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        const {applicationId, versionId} = this.props.params,
            {kioStore} = this.props,
            application = kioStore.getApplication(applicationId),
            version = kioStore.getApplicationVersion(applicationId, versionId),
            approvalCount = kioStore.getApprovals(applicationId, versionId).length,
            versionIds = kioStore.getApplicationVersions(applicationId).map(v => v.id);
        return <VersionForm
                edit={true}
                applicationId={applicationId}
                versionId={versionId}
                application={application}
                version={version}
                versionIds={versionIds}
                approvalCount={approvalCount}
                notificationActions={NOTIFICATION_ACTIONS}
                kioActions={KIO_ACTIONS} />;
    }
}

EditVersionFormHandler.isAllowed = function(routerState, state, [hasAuth]) {
    if (!hasAuth) {
        let error = new Error();
        error.name = 'Forbidden';
        error.message = 'You can only edit versions of your own applications!';
        error.status = 'u1F62D';
        return error;
    }
};
EditVersionFormHandler.displayName = 'EditVersionFormHandler';
EditVersionFormHandler.propTypes = {
    params: React.PropTypes.object.isRequired
};
EditVersionFormHandler.fetchData = function(routerState, state) {
    let {applicationId, versionId} = routerState.params;
    KIO_ACTIONS.fetchApprovals(applicationId, versionId);
    const app = KioGetter.getApplication(state.kio, applicationId),
          appPromise = !!app ?
                        Promise.resolve(app) :
                        KIO_ACTIONS.fetchApplication(applicationId);
    return appPromise.then(({team_id}) => Promise.all([
        requireAuth(state, team_id, MAGNIFICENT_ACTIONS),
        KIO_ACTIONS.fetchApplicationVersion(applicationId, versionId)
    ]));
};
let ConnectedEditVersionFormHandler = connect(state => ({
    kioStore: bindGettersToState(state.kio, KioGetter)
}))(EditVersionFormHandler);

class ApprovalFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        const {applicationId, versionId} = this.props.params,
            {kioStore, magnificentStore, userStore} = this.props,
            application = kioStore.getApplication(applicationId),
            version = kioStore.getApplicationVersion(applicationId, versionId),
            approvals = kioStore.getApprovals(applicationId, versionId),
            approvalTypes = kioStore.getApprovalTypes(),
            userInfos = approvals
                .map(({user_id}) => ({...userStore.getUserInfo(user_id), user_id}))
                .reduce((map, info) => {map[info.user_id] = info; return map;}, {}),
            editable = magnificentStore.getAuth(application.team_id);
        return <ApprovalForm
                    applicationId={applicationId}
                    versionId={versionId}
                    editable={editable}
                    application={application}
                    version={version}
                    approvals={approvals}
                    userInfos={userInfos}
                    approvalTypes={approvalTypes}
                    kioActions={KIO_ACTIONS}
                    notificationActions={NOTIFICATION_ACTIONS} />;
    }
}
ApprovalFormHandler.displayName = 'ApprovalFormHandler';
ApprovalFormHandler.propTypes = {
    params: React.PropTypes.object.isRequired
};
ApprovalFormHandler.fetchData = function(routerState, state) {
    let {applicationId, versionId} = routerState.params;
    const app = KioGetter.getApplication(state.kio, applicationId),
        appPromise = !app ? KIO_ACTIONS.fetchApplication(applicationId) : Promise.resolve(app);

    if (!KioGetter.getApplicationVersion(state.kio, applicationId, versionId)) {
        KIO_ACTIONS.fetchApplicationVersion(applicationId, versionId);
    }
    KIO_ACTIONS
        .fetchApprovals(applicationId, versionId)
        .then((args) => args[2]
                        .map(a => a.user_id)
                        .forEach(u => USER_ACTIONS.fetchUserInfo(u)));
    return appPromise.then(({team_id}) => Promise.all([
        KIO_ACTIONS.fetchApprovalTypes(applicationId),
        requireAuth(state, team_id, MAGNIFICENT_ACTIONS)
    ]));
};
let ConnectedApprovalFormHandler = connect(state => ({
    kioStore: bindGettersToState(state.kio, KioGetter),
    userStore: bindGettersToState(state.user, UserGetter),
    magnificentStore: bindGettersToState(state.magnificent, MagnificentGetter)
}))(ApprovalFormHandler);

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
                <Route path='version'>
                    <IndexRoute
                        onEnter={wrapEnter(VersionListHandler.fetchData)}
                        component={ConnectedVersionListHandler} />
                    <Route
                        path='create'
                        onEnter={wrapEnter(CreateVersionFormHandler.fetchData, CreateVersionFormHandler.isAllowed)}
                        component={ConnectedCreateVersionFormHandler} />
                    <Route
                        path='approve/:versionId'
                        onEnter={wrapEnter(ApprovalFormHandler.fetchData, ApprovalFormHandler.isAllowed)}
                        component={ConnectedApprovalFormHandler} />
                    <Route
                        path='detail/:versionId'
                        onEnter={wrapEnter(VersionDetailHandler.fetchData)}
                        component={ConnectedVersionDetailHandler} />
                    <Route
                        path='edit/:versionId'
                        onEnter={wrapEnter(EditVersionFormHandler.fetchData, EditVersionFormHandler.isAllowed)}
                        component={ConnectedEditVersionFormHandler} />
                </Route>
            </Route>
        </Route>;

export default ROUTES;
