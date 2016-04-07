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
    requireAccounts
} from 'common/src/router-utils';
import {connect} from 'react-redux';

import * as KioGetter from 'common/src/data/kio/kio-getter';
import * as UserGetter from 'common/src/data/user/user-getter';
import * as TeamGetter from 'common/src/data/team/team-getter';
import * as PieroneGetter from 'common/src/data/pierone/pierone-getter';
import * as TwintipGetter from 'common/src/data/twintip/twintip-getter';
import * as MintGetter from 'common/src/data/mint/mint-getter';
import * as EssentialsGetter from 'common/src/data/essentials/essentials-getter';

import * as NotificationActions from 'common/src/data/notification/notification-actions';
import * as KioActions from 'common/src/data/kio/kio-actions';
import * as UserActions from 'common/src/data/user/user-actions';
import * as TeamActions from 'common/src/data/team/team-actions';
import * as TwintipActions from 'common/src/data/twintip/twintip-actions';
import * as MintActions from 'common/src/data/mint/mint-actions';
import * as EssentialsActions from 'common/src/data/essentials/essentials-actions';
import * as PieroneActions from 'common/src/data/pierone/pierone-actions';

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
import Storage from 'common/src/storage';

const MINT_ACTIONS = bindActionsToStore(REDUX, MintActions),
      PIERONE_ACTIONS = bindActionsToStore(REDUX, PieroneActions),
      USER_ACTIONS = bindActionsToStore(REDUX, UserActions),
      KIO_ACTIONS = bindActionsToStore(REDUX, KioActions),
      ESSENTIALS_ACTIONS = bindActionsToStore(REDUX, EssentialsActions),
      NOTIFICATION_ACTIONS = bindActionsToStore(REDUX, NotificationActions),
      TEAM_ACTIONS = bindActionsToStore(REDUX, TeamActions),
      TWINTIP_ACTIONS = bindActionsToStore(REDUX, TwintipActions);

class AppListHandler extends React.Component {
    constructor() {
        super();
    }

    checkForTeam(props) {
        const {team, manageTabs} = props.location.query,
              tabAccounts = props.kioStore.getTabAccounts(),
              cloudAccounts = props.userStore.getUserCloudAccounts().map(a => a.name),
              preferredAccount = Storage.get('kio_preferredAccount');
        let replaceRoute = false;
        // check for accounts
        if (!tabAccounts.length) {
            KIO_ACTIONS.saveTabAccounts(cloudAccounts);
            replaceRoute = true;
            return;
        }
        if (team && tabAccounts.indexOf(team) === -1) {
            KIO_ACTIONS.saveTabAccounts(_.unique(tabAccounts.concat([team])).sort());
            return;
        }
        if (!team && preferredAccount && !manageTabs) {
            replaceRoute = true;
        }
        if (replaceRoute) {
            // make sure team is in tabs
            this.context.router.replace({
                pathname: appList(),
                query: {
                    team: preferredAccount || team
                }
            });
        }
    }

    componentWillMount() {
        this.checkForTeam(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.checkForTeam(nextProps);
        const {team} = nextProps.location.query;
        if (team !== this.props.location.query.team) {
            KIO_ACTIONS.fetchApplications(team);
            KIO_ACTIONS.fetchLatestApplicationVersions(team);
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
        const accounts = this.props.teamStore.getAccounts(),
              selectedTab = this.props.location.query.team,
              applicationsFetching = this.props.kioStore.getApplicationsFetchStatus(),
              tabAccounts = this.props.kioStore.getTabAccounts();
        return <ApplicationList
                    kioActions={KIO_ACTIONS}
                    tabAccounts={tabAccounts}
                    selectedTab={selectedTab}
                    applicationsFetching={applicationsFetching}
                    accounts={accounts}
                    onChangeTab={this.onChangeTab.bind(this)}
                    {...this.props} />;
    }
}
AppListHandler.displayName = 'AppListHandler';
AppListHandler.contextTypes = {
    router: React.PropTypes.object
};
AppListHandler.fetchData = function(routerState, state) {
    // team in query params => show that team
    // no team in query params => load preferred account
    // no preferred account => first of accounts
    const {team} = routerState.location.query;

    TEAM_ACTIONS.fetchAccounts();
    KIO_ACTIONS.loadTabAccounts();
    KIO_ACTIONS.fetchApplications(team);
    KIO_ACTIONS.fetchLatestApplicationVersions(team);

    // we need to know which accounts a user has access to
    return requireAccounts(state, USER_ACTIONS);
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
        return  <ApplicationForm
                    edit={false}
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
        requireAccounts(state, USER_ACTIONS),
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
        return <ApplicationForm
                        edit={true}
                        applicationId={this.props.params.applicationId}
                        notificationActions={NOTIFICATION_ACTIONS}
                        kioActions={KIO_ACTIONS}
                        {...this.props} />
    }
}
EditAppFormHandler.isAllowed = function(routerState, state) {
    let {applicationId} = routerState.params,
        application = KioGetter.getApplication(state.kio, applicationId),
        userTeams = UserGetter.getUserCloudAccounts(state.user),
        isOwnTeam = userTeams
                        .map(t => t.name)
                        .indexOf(application.team_id) >= 0;
    if (!isOwnTeam) {
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
    return Promise.all([
            KIO_ACTIONS.fetchApplication(routerState.params.applicationId),
            requireAccounts(state, USER_ACTIONS)
        ]);
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
        return <ApplicationDetail
                    applicationId={this.props.params.applicationId}
                    kioActions={KIO_ACTIONS}
                    notificationActions={NOTIFICATION_ACTIONS}
                    {...this.props} />;
    }
}
AppDetailHandler.displayName = 'AppDetailHandler';
AppDetailHandler.propTypes = {
    params: React.PropTypes.object.isRequired
};
AppDetailHandler.fetchData = function(routerState, state) {
    let {applicationId} = routerState.params;
    KIO_ACTIONS.fetchApplication(applicationId);
    KIO_ACTIONS.fetchApplicationVersions(applicationId);
    TWINTIP_ACTIONS.fetchApi(applicationId);
};
var ConnectedAppDetailHandler =
    connect(state => ({
        kioStore: bindGettersToState(state.kio, KioGetter),
        userStore: bindGettersToState(state.user, UserGetter),
        twintipStore: bindGettersToState(state.twintip, TwintipGetter)
    }))(AppDetailHandler);

class OAuthFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <OAuthForm
                    applicationId={this.props.params.applicationId}
                    mintActions={MINT_ACTIONS}
                    notificationActions={NOTIFICATION_ACTIONS}
                    {...this.props} />;
    }
}
OAuthFormHandler.displayName = 'OAuthFormHandler';
OAuthFormHandler.propTypes = {
    params: React.PropTypes.object.isRequired
};
OAuthFormHandler.fetchData = function(routerState, state) {
    let id = routerState.params.applicationId;
    ESSENTIALS_ACTIONS.fetchAllScopes();
    if (!KioGetter.getApplication(state.kio, id)) {
        KIO_ACTIONS.fetchApplication(id);
    }
    return Promise.all([
        requireAccounts(state, USER_ACTIONS),
        MINT_ACTIONS.fetchOAuthConfig(id)
    ]);
};
let ConnectedOAuthFormHandler = connect(state => ({
    mintStore: bindGettersToState(state.mint, MintGetter),
    kioStore: bindGettersToState(state.kio, KioGetter),
    userStore: bindGettersToState(state.user, UserGetter),
    essentialsStore: bindGettersToState(state.essentials, EssentialsGetter)
}))(OAuthFormHandler);

class AccessFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <AccessForm
                        applicationId={this.props.params.applicationId}
                        mintActions={MINT_ACTIONS}
                        notificationActions={NOTIFICATION_ACTIONS}
                        {...this.props} />;
    }
}
AccessFormHandler.displayName = 'AccessFormHandler';
AccessFormHandler.propTypes = {
    params: React.PropTypes.object.isRequired
};
AccessFormHandler.fetchData = function(routerState, state) {
    let id = routerState.params.applicationId;
    ESSENTIALS_ACTIONS.fetchAllScopes();
    if (!KioGetter.getApplication(state.kio, id)) {
        KIO_ACTIONS.fetchApplication(id);
    }
    return Promise.all([
        MINT_ACTIONS.fetchOAuthConfig(id),
        requireAccounts(state, USER_ACTIONS)
    ]);
};
let ConnectedAccessFormHandler = connect(state => ({
    mintStore: bindGettersToState(state.mint, MintGetter),
    kioStore: bindGettersToState(state.kio, KioGetter),
    userStore: bindGettersToState(state.user, UserGetter),
    essentialsStore: bindGettersToState(state.essentials, EssentialsGetter)
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
        return <VersionDetail
                    applicationId={this.props.params.applicationId}
                    versionId={this.props.params.versionId}
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

    // fetch the application if it's not there aleady
    if (!KioGetter.getApplication(state.kio, applicationId)) {
        KIO_ACTIONS.fetchApplication(applicationId);
    }

    // fetch version itself
    KIO_ACTIONS
        .fetchApplicationVersion(applicationId, versionId)
        .then(version => {
            // once it's there parse the artifact and fetch scm-source.json
            let {tag, team, artifact} = parseArtifact(version.artifact);
            PIERONE_ACTIONS.fetchScmSource(team, artifact, tag);
            PIERONE_ACTIONS.fetchTags(team, artifact);
        });
};
let ConnectedVersionDetailHandler = connect(state => ({
    kioStore: bindGettersToState(state.kio, KioGetter),
    userStore: bindGettersToState(state.user, UserGetter),
    pieroneStore: bindGettersToState(state.pierone, PieroneGetter)
}))(VersionDetailHandler);

class CreateVersionFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <VersionForm
                    edit={false}
                    applicationId={this.props.params.applicationId}
                    versionId={this.props.params.versionId}
                    kioActions={KIO_ACTIONS}
                    notificationActions={NOTIFICATION_ACTIONS}
                    {...this.props} />;
    }
}
CreateVersionFormHandler.displayName = 'CreateVersionFormHandler';
CreateVersionFormHandler.propTypes = {
    params: React.PropTypes.object.isRequired
};
CreateVersionFormHandler.fetchData = function(routerState, state) {
    let {applicationId} = routerState.params;
    return Promise.all([
        requireAccounts(state, USER_ACTIONS),
        !!KioGetter.getApplication(state.kio, applicationId) ?
            Promise.resolve() :
            KIO_ACTIONS.fetchApplication(applicationId),
        KIO_ACTIONS.fetchApplicationVersions(applicationId)
    ]);
};
CreateVersionFormHandler.isAllowed = function(routerState, state) {
    let {applicationId} = routerState.params,
        application = KioGetter.getApplication(state.kio, applicationId),
        userTeams = UserGetter.getUserCloudAccounts(state.user),
        isOwnTeam = userTeams.map(t => t.name).indexOf(application.team_id) >= 0;
    if (!isOwnTeam) {
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
        return <VersionForm
                edit={true}
                applicationId={this.props.params.applicationId}
                versionId={this.props.params.versionId}
                notificationActions={NOTIFICATION_ACTIONS}
                kioActions={KIO_ACTIONS}
                {...this.props} />;
    }
}

EditVersionFormHandler.isAllowed = function(routerState, state) {
    let {applicationId} = routerState.params,
        application = KioGetter.getApplication(state.kio, applicationId),
        userTeams = UserGetter.getUserCloudAccounts(state.user),
        isOwnTeam = userTeams.map(t => t.name).indexOf(application.team_id) >= 0;
    if (!isOwnTeam) {
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
    return Promise.all([
        requireAccounts(state, USER_ACTIONS),
        KIO_ACTIONS.fetchApplicationVersion(applicationId, versionId),
        KioGetter.getApplication(state.kio, applicationId) ?
            Promise.resolve() :
            KIO_ACTIONS.fetchApplication(applicationId)
    ]);
};
let ConnectedEditVersionFormHandler = connect(state => ({
    kioStore: bindGettersToState(state.kio, KioGetter)
}))(EditVersionFormHandler);

class ApprovalFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <ApprovalForm
                    applicationId={this.props.params.applicationId}
                    versionId={this.props.params.versionId}
                    kioActions={KIO_ACTIONS}
                    notificationActions={NOTIFICATION_ACTIONS}
                    {...this.props} />;
    }
}
ApprovalFormHandler.displayName = 'ApprovalFormHandler';
ApprovalFormHandler.propTypes = {
    params: React.PropTypes.object.isRequired
};
ApprovalFormHandler.fetchData = function(routerState, state) {
    let {applicationId, versionId} = routerState.params;
    if (!KioGetter.getApplication(state.kio, applicationId)) {
        KIO_ACTIONS.fetchApplication(applicationId);
    }
    if (!KioGetter.getApplicationVersion(state.kio, applicationId, versionId)) {
        KIO_ACTIONS.fetchApplicationVersion(applicationId, versionId);
    }
    KIO_ACTIONS
        .fetchApprovals(applicationId, versionId)
        .then((args) => args[2]
                        .map(a => a.user_id)
                        .forEach(u => USER_ACTIONS.fetchUserInfo(u)));
    return KIO_ACTIONS.fetchApprovalTypes(applicationId);
};
let ConnectedApprovalFormHandler = connect(state => ({
    kioStore: bindGettersToState(state.kio, KioGetter),
    pieroneStore: bindGettersToState(state.pierone, PieroneGetter),
    userStore: bindGettersToState(state.user, UserGetter)
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
