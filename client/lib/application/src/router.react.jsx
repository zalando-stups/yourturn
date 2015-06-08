import React from 'react';
import {Route} from 'react-router';
import FluxComponent from 'flummox/component';
import Flux from './flux';

import List from './application-list/application-list.jsx';

const APP_FLUX = new Flux(),
      MINT_ACTIONS = APP_FLUX.getActions('mint'),
      KIO_ACTIONS = APP_FLUX.getActions('kio'),
      KIO_STORE = APP_FLUX.getStore('kio');

class ListHandler extends React.Component {
    constructor() {
        super();
    }

    render() {
        return  <FluxComponent
                    flux={APP_FLUX}
                    connectToStores={['kio']}>

                    <List globalFlux={this.props.globalFlux} />
                </FluxComponent>;
    }
}

ListHandler.fetchData = function() {
    if (!KIO_STORE.getApplications().length) {
        KIO_ACTIONS.fetchApplications();
    }
};

/**
 *  <Route path='create' handler={AppFormHandler} />
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
        <Route path='/application' handler={ListHandler}>
        </Route>;

export default ROUTES;