import App from './App.jsx';
import React from 'react';

import Router from 'react-router';
import routes from './routes.jsx';

React.render( <App />, document.body );

Router.run(
    routes,
    Router.HistoryLocation,
    (Handler) => React.render(<Handler />, document.body));