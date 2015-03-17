import React from 'react';
import Router from 'react-router';
import YourTurn from './YourTurn.jsx';
import routes from './routes.jsx';

Router.run(
    routes,
    Router.HistoryLocation,
    (Handler) => React.render(<Handler />, document.body));