import React from 'react';
import App from './Application.jsx';
import Router from 'react-router';
import routes from './routes.jsx';

Router.run(
    routes,
    Router.HistoryLocation,
    (Handler) => React.render(<Handler />, document.body));