import React from 'react';
import {Route, DefaultRoute} from 'react-router';
import FluxComponent from 'flummox/component';
import Flux from './flux';
import {parseArtifact} from 'application/src/util';

import ApplicationList from './application-list/application-list.jsx';
import ApplicationForm from './application-form/application-form.jsx';
import ApplicationDetail from './application-detail/application-detail.jsx';
import OAuthForm from './oauth-form/oauth-form.jsx';
import AccessForm from './access-form/access-form.jsx';
import VersionList from './version-list/version-list.jsx';
import VersionDetail from './version-detail/version-detail.jsx';

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
        return  <FluxComponent
                    flux={APP_FLUX}
                    connectToStores={['kio']}>

                    <ApplicationList
                        globalFlux={this.props.globalFlux} />
                </FluxComponent>;
    }
}
AppListHandler.fetchData = function() {
    if (!KIO_STORE.getApplications().length) {
        KIO_ACTIONS.fetchApplications();
    }
};


class CreateAppFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return  <FluxComponent
                    flux={APP_FLUX}
                    connectToStores={['kio']}>

                    <ApplicationForm
                        edit={false}
                        globalFlux={this.props.globalFlux} />
                </FluxComponent>;
    }
}
CreateAppFormHandler.fetchData = function(state) {
    return KIO_ACTIONS.fetchApplications();
};


class EditAppFormHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return  <FluxComponent
                    flux={APP_FLUX}
                    connectToStores={['kio']}>

                    <ApplicationForm
                        edit={true}
                        applicationId={this.props.params.applicationId}
                        globalFlux={this.props.globalFlux} />
                </FluxComponent>;
    }
}
EditAppFormHandler.fetchData = function(state) {
    return KIO_ACTIONS.fetchApplication(state.params.applicationId);
};


class AppDetailHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <FluxComponent
                    flux={APP_FLUX}
                    connectToStores={['kio', 'pierone', 'twintip']}>

                    <ApplicationDetail
                        applicationId={this.props.params.applicationId}
                        globalFlux={this.props.globalFlux} />
                </FluxComponent>;
    }
}
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
                    connectToStores={['mint', 'essentials', 'kio']}>

                    <OAuthForm
                        applicationId={this.props.params.applicationId}
                        globalFlux={this.props.globalFlux} />
                </FluxComponent>;
    }
}
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
                    connectToStores={['mint', 'essentials', 'kio']}>

                    <AccessForm
                        applicationId={this.props.params.applicationId}
                        globalFlux={this.props.globalFlux} />
                </FluxComponent>;
    }
}
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
                </FluxComponent>
    }
}
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
                    connectToStores={['kio', 'pierone']}>

                    <VersionDetail
                        applicationId={this.props.params.applicationId}
                        versionId={this.props.params.versionId}
                        globalFlux={this.props.globalFlux} />
                </FluxComponent>;
    }
}
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



/**
    <Route path='create' handler={VersionFormHandler} />
    <Route path='edit/:ver' handler={VersionFormHandler} />
    <Route path='approve' />
   
 */

const ROUTES =
        <Route path='/application'>
            <DefaultRoute handler={AppListHandler} />
            <Route path='create' handler={CreateAppFormHandler} />
            <Route path='edit/:applicationId' handler={EditAppFormHandler} />
            <Route path='oauth/:applicationId' handler={OAuthFormHandler} />
            <Route path='access-control/:applicationId' handler={AccessFormHandler} />
            <Route path='detail/:applicationId'>
                <DefaultRoute handler={AppDetailHandler} />
                <Route path='version'>
                    <DefaultRoute handler={VersionListHandler} />
                    <Route path='detail/:versionId' handler={VersionDetailHandler} />

                </Route>
            </Route>
        </Route>;

export default ROUTES;