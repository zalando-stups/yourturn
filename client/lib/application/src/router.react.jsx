import React from 'react';
import {Route, DefaultRoute} from 'react-router';
import FluxComponent from 'flummox/component';
import Flux from './flux';

import ApplicationList from './application-list/application-list.jsx';
import ApplicationForm from './application-form/application-form.jsx';
import ApplicationDetail from './application-detail/application-detail.jsx';
import OAuthForm from './oauth-form/oauth-form.jsx';
import AccessForm from './access-form/access-form.jsx';

const APP_FLUX = new Flux(),
      MINT_ACTIONS = APP_FLUX.getActions('mint'),
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

/**
 *  
    
    <Route path='edit/:id' handler={AppFormHandler} />
    
        <Route path=':id' handler={AppDetailHandler} />
        <Route path=':id/version' handler={VersionListHandler}>
            <Route path='create' handler={VersionFormHandler} />
            <Route path='detail/:ver' handler={VersionDetailHandler} />
            <Route path='edit/:ver' handler={VersionFormHandler} />
            <Route path='approve/:ver' handler={ApprovalFormHandler} />
        </Route>
    </Route>
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
            </Route>
        </Route>;

export default ROUTES;