import {DefaultRoute, Route} from 'react-router';
import React from 'react';
import RootPage from './YourTurn.jsx';

/**
 * if we're serious about micro UIs we have to find a way to
 * modularize the router incl passing Flux instance around
 */
import Application from 'application/src/Application.jsx';
import ApplicationListView from 'application/src/wrapper/ApplicationListWrapper.jsx';
import ApplicationView from 'application/src/wrapper/ApplicationWrapper.jsx';

let routes = (
    <Route name="root" path="/" handler={ RootPage }>
        <DefaultRoute handler={Application} />
        <Route name="application" path="application">
            <DefaultRoute handler={ApplicationListView} />
            <Route name="application-detail" path=":id" handler={ApplicationView} />
        </Route>
    </Route>
);

export default routes;