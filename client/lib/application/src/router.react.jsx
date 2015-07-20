import React from 'react';
import {Route, DefaultRoute} from 'react-router';
import FluxComponent from 'flummox/component';
import Flux from './flux';
import {parseArtifact} from 'application/src/util';
import {requireAccounts} from 'common/src/util';

import ApplicationList from './application-list/application-list.jsx';
import ApplicationForm from './application-form/application-form.jsx';
import ApplicationDetail from './application-detail/application-detail.jsx';
import OAuthForm from './oauth-form/oauth-form.jsx';
import AccessForm from './access-form/access-form.jsx';
import VersionList from './version-list/version-list.jsx';
import VersionForm from './version-form/version-form.jsx';
import VersionDetail from './version-detail/version-detail.jsx';
import ApprovalForm from './approval-form/approval-form.jsx';

const APP_FLUX = new Flux(),
      MINT_ACTIONS = APP_FLUX.getActions('mint'),
      PIERONE_ACTIONS = APP_FLUX.getActions('pierone'),
      KIO_ACTIONS = APP_FLUX.getActions('kio'),
      KIO_STORE = APP_FLUX.getStore('kio');

class AppListHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <FluxComponent
                    flux={APP_FLUX}
                    globalFlux={this.props.globalFlux}
                    connectToStores={['kio']}>

                    <ApplicationList />
                </FluxComponent>;
    }
}
AppListHandler.displayName = 'AppListHandler';
AppListHandler.propTypes = {
    globalFlux: React.PropTypes.object.isRequired,
    params: React.PropTypes.object.isRequired
};
AppListHandler.fetchData = function(state, globalFlux) {
    KIO_ACTIONS
    .fetchApplications()
    .then(apps =>
        requireAccounts(globalFlux)
        .then(accs => {
            let ids = accs.map(acc => acc.name);
            apps
            .filter(app => ids.indexOf(app.team_id) >= 0)
            .forEach(app => KIO_ACTIONS.fetchApplicationVersions(app.id));
        }));
};


class CreateAppFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <FluxComponent
                    flux={APP_FLUX}
                    globalFlux={this.props.globalFlux}
                    connectToStores={['kio']}>

                    <ApplicationForm
                        edit={false} />
                </FluxComponent>;
    }
}
CreateAppFormHandler.displayName = 'CreateAppFormHandler';
CreateAppFormHandler.propTypes = {
    globalFlux: React.PropTypes.object.isRequired,
    params: React.PropTypes.object.isRequired
};
CreateAppFormHandler.fetchData = function(state, globalFlux) {
    return Promise.all([
        requireAccounts(globalFlux),
        KIO_ACTIONS.fetchApplications()
    ]);
};


class EditAppFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <FluxComponent
                    flux={APP_FLUX}
                    globalFlux={this.props.globalFlux}
                    connectToStores={['kio']}>

                    <ApplicationForm
                        edit={true}
                        applicationId={this.props.params.applicationId} />
                </FluxComponent>;
    }
}
EditAppFormHandler.isAllowed = function(state, globalFlux) {
    let {applicationId} = state.params,
        application = KIO_STORE.getApplication(applicationId),
        userTeams = globalFlux.getStore('user').getTeamMemberships(),
        isOwnTeam = userTeams.map(t => t.id).indexOf(application.team_id) >= 0;
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
    globalFlux: React.PropTypes.object.isRequired,
    params: React.PropTypes.object.isRequired
};
EditAppFormHandler.fetchData = function(state, globalFlux) {
    return Promise.all([
            KIO_ACTIONS.fetchApplication(state.params.applicationId),
            requireAccounts(globalFlux)
        ]);
};


class AppDetailHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <FluxComponent
                    flux={APP_FLUX}
                    globalFlux={this.props.globalFlux}
                    connectToStores={['kio', 'pierone', 'twintip']}>

                    <ApplicationDetail
                        applicationId={this.props.params.applicationId} />
                </FluxComponent>;
    }
}
AppDetailHandler.displayName = 'AppDetailHandler';
AppDetailHandler.propTypes = {
    globalFlux: React.PropTypes.object.isRequired,
    params: React.PropTypes.object.isRequired
};
AppDetailHandler.fetchData = function(state) {
    KIO_ACTIONS.fetchApplication(state.params.applicationId);
    KIO_ACTIONS.fetchApplicationVersions(state.params.applicationId);
    APP_FLUX.getActions('twintip').fetchApi(state.params.applicationId);
};


class OAuthFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <FluxComponent
                    flux={APP_FLUX}
                    globalFlux={this.props.globalFlux}
                    connectToStores={['mint', 'essentials', 'kio']}>

                    <OAuthForm
                        applicationId={this.props.params.applicationId} />
                </FluxComponent>;
    }
}
OAuthFormHandler.displayName = 'OAuthFormHandler';
OAuthFormHandler.propTypes = {
    globalFlux: React.PropTypes.object.isRequired,
    params: React.PropTypes.object.isRequired
};
OAuthFormHandler.fetchData = function(state) {
    let id = state.params.applicationId;
    APP_FLUX.getActions('essentials').fetchAllScopes();
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
                    flux={APP_FLUX}
                    globalFlux={this.props.globalFlux}
                    connectToStores={['mint', 'essentials', 'kio']}>

                    <AccessForm
                        applicationId={this.props.params.applicationId} />
                </FluxComponent>;
    }
}
AccessFormHandler.displayName = 'AccessFormHandler';
AccessFormHandler.propTypes = {
    globalFlux: React.PropTypes.object.isRequired,
    params: React.PropTypes.object.isRequired
};
AccessFormHandler.fetchData = function(state) {
    let id = state.params.applicationId;
    APP_FLUX.getActions('essentials').fetchAllScopes();
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
                    flux={APP_FLUX}
                    connectToStores={['kio']}>

                    <VersionList
                        applicationId={this.props.params.applicationId} />
                </FluxComponent>;
    }
}
VersionListHandler.displayName = 'VersionListHandler';
VersionListHandler.propTypes = {
    globalFlux: React.PropTypes.object.isRequired,
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
                    flux={APP_FLUX}
                    globalFlux={this.props.globalFlux}
                    connectToStores={['kio', 'pierone']}>

                    <VersionDetail
                        applicationId={this.props.params.applicationId}
                        versionId={this.props.params.versionId} />
                </FluxComponent>;
    }
}
VersionDetailHandler.displayName = 'VersionDetailHandler';
VersionDetailHandler.propTypes = {
    globalFlux: React.PropTypes.object.isRequired,
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
                    flux={APP_FLUX}
                    globalFlux={this.props.globalFlux}
                    connectToStores={['kio', 'pierone']}>

                    <ApprovalForm
                        applicationId={this.props.params.applicationId}
                        versionId={this.props.params.versionId} />
                </FluxComponent>;
    }
}
ApprovalFormHandler.displayName = 'ApprovalFormHandler';
ApprovalFormHandler.propTypes = {
    globalFlux: React.PropTypes.object.isRequired,
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
    KIO_ACTIONS.fetchApprovals(applicationId, versionId);
    return KIO_ACTIONS.fetchApprovalTypes(applicationId);
};


class CreateVersionFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <FluxComponent
                    flux={APP_FLUX}
                    globalFlux={this.props.globalFlux}
                    connectToStores={['kio']}>

                    <VersionForm
                        edit={false}
                        applicationId={this.props.params.applicationId}
                        versionId={this.props.params.versionId} />
                </FluxComponent>;
    }
}
CreateVersionFormHandler.displayName = 'CreateVersionFormHandler';
CreateVersionFormHandler.propTypes = {
    globalFlux: React.PropTypes.object.isRequired,
    params: React.PropTypes.object.isRequired
};
CreateVersionFormHandler.fetchData = function(state) {
    let {applicationId} = state.params;
    return Promise.all([
        !!KIO_STORE.getApplication(applicationId) ? Promise.resolve() : KIO_ACTIONS.fetchApplication(applicationId),
        KIO_ACTIONS.fetchApplicationVersions(applicationId)
    ]);
};


class EditVersionFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <FluxComponent
                    flux={APP_FLUX}
                    globalFlux={this.props.globalFlux}
                    connectToStores={['kio']}>

                    <VersionForm
                        edit={true}
                        applicationId={this.props.params.applicationId}
                        versionId={this.props.params.versionId} />
                </FluxComponent>;
    }
}
EditVersionFormHandler.isAllowed = function(state, globalFlux) {
    let {applicationId} = state.params,
        application = KIO_STORE.getApplication(applicationId),
        userTeams = globalFlux.getStore('user').getTeamMemberships(),
        isOwnTeam = userTeams.map(t => t.id).indexOf(application.team_id) >= 0;
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
    globalFlux: React.PropTypes.object.isRequired,
    params: React.PropTypes.object.isRequired
};
EditVersionFormHandler.fetchData = function(state) {
    let {applicationId, versionId} = state.params;
    KIO_ACTIONS.fetchApprovals(applicationId, versionId);
    return Promise.all([
        KIO_ACTIONS.fetchApplicationVersion(applicationId, versionId),
        KIO_STORE.getApplication(applicationId) ?
            Promise.resolve() :
            KIO_ACTIONS.fetchApplication(applicationId)
    ]);
};

const ROUTES =
        <Route name='application-appList' path='application'>
            <DefaultRoute handler={AppListHandler} />
            <Route name='application-appCreate' path='create' handler={CreateAppFormHandler} />
            <Route name='application-appEdit' path='edit/:applicationId' handler={EditAppFormHandler} />
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
