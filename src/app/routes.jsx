import {Route} from 'react-router';
import React from 'react';
import RootPage from 'app/App.jsx';

let routes = (
    <Route name="root" path="/" handler={ RootPage }>
    </Route>
);

export default routes;