import {DefaultRoute, Route} from 'react-router';
import React from 'react';
import RootPage from './YourTurn.jsx';
import ApplicationRoutes from 'application/src/routes.jsx';

let routes = (
    <Route name='root' path='/' handler={ RootPage }>
        {ApplicationRoutes}
    </Route>
);

export default routes;