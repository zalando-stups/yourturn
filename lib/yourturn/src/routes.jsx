import {DefaultRoute, Route} from 'react-router';
import React from 'react';
import RootPage from './YourTurn.jsx';

import ApplicationListView from 'application/src/ApplicationListWrapper.jsx';
import ApplicationView from 'application/src/ApplicationWrapper.jsx';

let routes = (
    <Route name="root" path="/" handler={ RootPage }>
        <Route name="application" path="application">
            <DefaultRoute handler={ApplicationListView} />
            <Route name="application-detail" path=":id" handler={ApplicationView} />
        </Route>
    </Route>
);

export default routes;