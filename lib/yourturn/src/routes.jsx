import {DefaultRoute, Route} from 'react-router';
import React from 'react';
import RootPage from './YourTurn.jsx';

/**
 * if we're serious about micro UIs we have to find a way to
 * modularize the router incl passing Flux instance around
 */
import Application from 'application/src/Application.jsx';
import ApplicationList from 'application/src/wrapper/ApplicationListWrapper.jsx';
import ApplicationDetail from 'application/src/wrapper/ApplicationDetailWrapper.jsx';

let routes = (
    <Route name='root' path='/' handler={ RootPage }>
        <DefaultRoute handler={ApplicationList} />
        <Route name='application' path='application'>
            <DefaultRoute handler={ApplicationList} />
            <Route name='application-detail' path=':id' handler={ApplicationDetail} />
        </Route>
    </Route>
);

export default routes;