import React from 'react';
import {Route, DefaultRoute} from 'react-router';
import FluxComponent from 'flummox/component';
import Flux from './flux';

import ApplicationList from './application-list/application-list.jsx';
import ApplicationForm from './application-form/application-form.jsx';

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

/**
 *  <Route path='oauth/:id' handler={OAuthFormHandler} />
    <Route path='access-control/:id' handler={AccessFormHandler} />
    <Route path='edit/:id' handler={AppFormHandler} />
    <Route path='detail'>
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
        </Route>;

export default ROUTES;