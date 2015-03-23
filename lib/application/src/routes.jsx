import React from 'react';
import {Route, DefaultRoute} from 'react-router';
import ApplicationList from './wrapper/ApplicationListWrapper.jsx';
import ApplicationDetail from './wrapper/ApplicationDetailWrapper.jsx';

export default (<Route name='application' path='application'>
            <DefaultRoute handler={ApplicationList} />
            <Route name='application-detail' path=':id' handler={ApplicationDetail} />
        </Route>);