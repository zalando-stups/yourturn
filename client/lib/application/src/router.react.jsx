import React from 'react';
import {Route, DefaultRoute} from 'react-router';
import FluxComponent from 'flummox/component';
import FLUX from 'yourturn/src/flux';
import REDUX from 'yourturn/src/redux';
import {parseArtifact} from 'application/src/util';
import {requireAccounts, bindGettersToState, bindActionsToStore} from 'common/src/util';
import {connect} from 'react-redux';

import * as KioGetter from 'common/src/data/kio/kio-getter';
import * as UserGetter from 'common/src/data/user/user-getter';

import * as NotificationActions from 'common/src/data/notification/notification-actions';

import * as KioActions from 'common/src/data/kio/kio-actions';
import * as UserActions from 'common/src/data/user/user-actions';

import ApplicationList from './application-list/application-list.jsx';
import ApplicationForm from './application-form/application-form.jsx';
import ApplicationDetail from './application-detail/application-detail.jsx';
import OAuthForm from './oauth-form/oauth-form.jsx';
import AccessForm from './access-form/access-form.jsx';
import VersionList from './version-list/version-list.jsx';
import VersionForm from './version-form/version-form.jsx';
import VersionDetail from './version-detail/version-detail.jsx';
import ApprovalForm from './approval-form/approval-form.jsx';

const MINT_ACTIONS = FLUX.getActions('mint'),
      MINT_STORE = FLUX.getStore('mint'),
      PIERONE_ACTIONS = FLUX.getActions('pierone'),
      PIERONE_STORE = FLUX.getStore('pierone'),
      USER_ACTIONS = bindActionsToStore(REDUX, UserActions),
      KIO_ACTIONS = bindActionsToStore(REDUX, KioActions),
      ESSENTIALS_STORE = FLUX.getStore('essentials'),
      NOTIFICATION_ACTIONS = bindActionsToStore(REDUX, NotificationActions),
      TWINTIP_STORE = FLUX.getStore('twintip');

class AppListHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <ApplicationList
                    userStore={this.props.userStore}
                    kioActions={KIO_ACTIONS}
                    kioStore={this.props.kioStore} />;
    }
}
AppListHandler.displayName = 'AppListHandler';
AppListHandler.propTypes = {
    params: React.PropTypes.object.isRequired
};
AppListHandler.fetchData = function(routerState, state) {
    // get all applications no matter what
    KIO_ACTIONS.fetchApplications();
    // we need to know which accounts a user has access to
    return requireAccounts(state, USER_ACTIONS)
            .then(accs => {
                // so we can determine a preselected account in tabs
                let preferredAcc = KioGetter.getPreferredAccount(state.kio);
                if (!preferredAcc) {
                    preferredAcc = KIO_ACTIONS.savePreferredAccount(accs[0].name);
                }
                // and fetch latest application versions for it
                KIO_ACTIONS
                .fetchLatestApplicationVersions(preferredAcc);
            });
};
var ConnectedAppListHandler =
        connect(state => ({
            kioStore: bindGettersToState(state.kio, KioGetter),
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
                    kioStore={this.props.kioStore}
                    userStore={this.props.userStore} />;
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
                        userStore={this.props.userStore}
                        kioActions={KIO_ACTIONS}
                        kioStore={this.props.kioStore} />
    }
}
EditAppFormHandler.isAllowed = function(routerState, state) {
    console.log(routerState, state);
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
        return <FluxComponent
                    flux={FLUX}
                    connectToStores={['kio', 'pierone', 'twintip']}>

                    <ApplicationDetail
                        applicationId={this.props.params.applicationId}
                        kioStore={KIO_STORE}
                        kioActions={KIO_ACTIONS}
                        pieroneStore={PIERONE_STORE}
                        twintipStore={TWINTIP_STORE}
                        notificationActions={NOTIFICATION_ACTIONS}
                        userStore={USER_STORE} />
                </FluxComponent>;
    }
}
AppDetailHandler.displayName = 'AppDetailHandler';
AppDetailHandler.propTypes = {
    params: React.PropTypes.object.isRequired
};
AppDetailHandler.fetchData = function(state) {
    KIO_ACTIONS.fetchApplication(state.params.applicationId);
    KIO_ACTIONS.fetchApplicationVersions(state.params.applicationId);
    FLUX.getActions('twintip').fetchApi(state.params.applicationId);
};


class OAuthFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <FluxComponent
                    flux={FLUX}
                    connectToStores={['mint', 'essentials', 'kio']}>

                    <OAuthForm
                        applicationId={this.props.params.applicationId}
                        mintActions={MINT_ACTIONS}
                        notificationActions={NOTIFICATION_ACTIONS}
                        mintStore={MINT_STORE}
                        userStore={USER_STORE}
                        essentialsStore={ESSENTIALS_STORE}
                        kioStore={KIO_STORE} />
                </FluxComponent>;
    }
}
OAuthFormHandler.displayName = 'OAuthFormHandler';
OAuthFormHandler.propTypes = {
    params: React.PropTypes.object.isRequired
};
OAuthFormHandler.fetchData = function(state) {
    let id = state.params.applicationId;
    FLUX.getActions('essentials').fetchAllScopes();
    if (!KIO_STORE.getApplication(id)) {
        KIO_ACTIONS.fetchApplication(id);
    }
    return MINT_ACTIONS.fetchOAuthConfig(id);
};


class AccessFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <FluxComponent
                    flux={FLUX}
                    connectToStores={['mint', 'essentials', 'kio']}>

                    <AccessForm
                        applicationId={this.props.params.applicationId}
                        mintActions={MINT_ACTIONS}
                        notificationActions={NOTIFICATION_ACTIONS}
                        mintStore={MINT_STORE}
                        userStore={USER_STORE}
                        essentialsStore={ESSENTIALS_STORE}
                        kioStore={KIO_STORE} />
                </FluxComponent>;
    }
}
AccessFormHandler.displayName = 'AccessFormHandler';
AccessFormHandler.propTypes = {
    params: React.PropTypes.object.isRequired
};
AccessFormHandler.fetchData = function(state) {
    let id = state.params.applicationId;
    FLUX.getActions('essentials').fetchAllScopes();
    if (!KIO_STORE.getApplication(id)) {
        KIO_ACTIONS.fetchApplication(id);
    }
    return MINT_ACTIONS.fetchOAuthConfig(id);
};


class VersionListHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <FluxComponent
                    flux={FLUX}
                    connectToStores={['kio']}>

                    <VersionList
                        applicationId={this.props.params.applicationId}
                        kioStore={KIO_STORE} />
                </FluxComponent>;
    }
}
VersionListHandler.displayName = 'VersionListHandler';
VersionListHandler.propTypes = {
    params: React.PropTypes.object.isRequired
};
VersionListHandler.fetchData = function(state) {
    let id = state.params.applicationId;
    KIO_ACTIONS.fetchApplicationVersions(id);
    if (!KIO_STORE.getApplication(id)) {
        KIO_ACTIONS.fetchApplication(id);
    }
};

class VersionDetailHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <FluxComponent
                    flux={FLUX}
                    connectToStores={['kio', 'pierone']}>

                    <VersionDetail
                        applicationId={this.props.params.applicationId}
                        versionId={this.props.params.versionId}
                        kioStore={KIO_STORE}
                        userStore={USER_STORE}
                        pieroneStore={PIERONE_STORE} />
                </FluxComponent>;
    }
}
VersionDetailHandler.displayName = 'VersionDetailHandler';
VersionDetailHandler.propTypes = {
    params: React.PropTypes.object.isRequired
};
VersionDetailHandler.fetchData = function(state) {
    let {applicationId, versionId} = state.params;
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
    if (!KIO_STORE.getApplication(applicationId)) {
        KIO_ACTIONS.fetchApplication(applicationId);
    }
};


class ApprovalFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <FluxComponent
                    flux={FLUX}
                    connectToStores={['kio', 'pierone', 'user']}>

                    <ApprovalForm
                        applicationId={this.props.params.applicationId}
                        versionId={this.props.params.versionId}
                        kioActions={KIO_ACTIONS}
                        kioStore={KIO_STORE}
                        pieroneStore={PIERONE_STORE}
                        userStore={USER_STORE} />
                </FluxComponent>;
    }
}
ApprovalFormHandler.displayName = 'ApprovalFormHandler';
ApprovalFormHandler.propTypes = {
    params: React.PropTypes.object.isRequired
};
ApprovalFormHandler.fetchData = function(state) {
    let {applicationId, versionId} = state.params;
    if (!KIO_STORE.getApplication(applicationId)) {
        KIO_ACTIONS.fetchApplication(applicationId);
    }
    if (!KIO_STORE.getApplicationVersion(applicationId, versionId)) {
        KIO_ACTIONS.fetchApplicationVersion(applicationId, versionId);
    }
    KIO_ACTIONS
        .fetchApprovals(applicationId, versionId)
        .then((args) => args[2]
                        .map(a => a.user_id)
                                .forEach(u => USER_ACTIONS.fetchUserInfo(u)));
    return KIO_ACTIONS.fetchApprovalTypes(applicationId);
};


class CreateVersionFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <FluxComponent
                    flux={FLUX}
                    connectToStores={['kio']}>

                    <VersionForm
                        edit={false}
                        applicationId={this.props.params.applicationId}
                        versionId={this.props.params.versionId}
                        kioActions={KIO_ACTIONS}
                        notificationActions={NOTIFICATION_ACTIONS}
                        kioStore={KIO_STORE} />
                </FluxComponent>;
    }
}
CreateVersionFormHandler.displayName = 'CreateVersionFormHandler';
CreateVersionFormHandler.propTypes = {
    params: React.PropTypes.object.isRequired
};
CreateVersionFormHandler.fetchData = function(state) {
    let {applicationId} = state.params;
    return Promise.all([
        requireAccounts(FLUX),
        !!KIO_STORE.getApplication(applicationId) ?
            Promise.resolve() :
            KIO_ACTIONS.fetchApplication(applicationId),
        KIO_ACTIONS.fetchApplicationVersions(applicationId)
    ]);
};
CreateVersionFormHandler.isAllowed = function(state) {
    let {applicationId} = state.params,
        application = KIO_STORE.getApplication(applicationId),
        userTeams = USER_STORE.getUserCloudAccounts(),
        isOwnTeam = userTeams.map(t => t.name).indexOf(application.team_id) >= 0;
    if (!isOwnTeam) {
        let error = new Error();
        error.name = 'Forbidden';
        error.message = 'You can only add versions for your own applications!';
        error.status = 'u1F62D';
        return error;
    }
};


class EditVersionFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <FluxComponent
                    flux={FLUX}
                    connectToStores={['kio']}>

                    <VersionForm
                        edit={true}
                        applicationId={this.props.params.applicationId}
                        versionId={this.props.params.versionId}
                        notificationActions={NOTIFICATION_ACTIONS}
                        kioActions={KIO_ACTIONS}
                        kioStore={KIO_STORE} />
                </FluxComponent>;
    }
}
EditVersionFormHandler.isAllowed = function(state) {
    let {applicationId} = state.params,
        application = KIO_STORE.getApplication(applicationId),
        userTeams = USER_STORE.getUserCloudAccounts(),
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
EditVersionFormHandler.fetchData = function(state) {
    let {applicationId, versionId} = state.params;
    KIO_ACTIONS.fetchApprovals(applicationId, versionId);
    return Promise.all([
        requireAccounts(FLUX),
        KIO_ACTIONS.fetchApplicationVersion(applicationId, versionId),
        KIO_STORE.getApplication(applicationId) ?
            Promise.resolve() :
            KIO_ACTIONS.fetchApplication(applicationId)
    ]);
};

const ROUTES =
        <Route name='application-appList' path='application'>
            <DefaultRoute handler={ConnectedAppListHandler} />
            <Route name='application-appCreate' path='create' handler={ConnectedCreateAppFormHandler} />
            <Route name='application-appEdit' path='edit/:applicationId' handler={ConnectedEditAppFormHandler} />
            <Route name='application-appOAuth' path='oauth/:applicationId' handler={OAuthFormHandler} />
            <Route name='application-appAccess' path='access-control/:applicationId' handler={AccessFormHandler} />
            <Route name='application-appDetail' path='detail/:applicationId'>
                <DefaultRoute handler={AppDetailHandler} />
                <Route name='application-verList' path='version'>
                    <DefaultRoute handler={VersionListHandler} />
                    <Route name='application-verCreate' path='create' handler={CreateVersionFormHandler} />
                    <Route name='application-verApproval' path='approve/:versionId' handler={ApprovalFormHandler} />
                    <Route name='application-verDetail' path='detail/:versionId' handler={VersionDetailHandler} />
                    <Route name='application-verEdit' path='edit/:versionId' handler={EditVersionFormHandler} />
                </Route>
            </Route>
        </Route>;

export default ROUTES;
