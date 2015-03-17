import React from 'react';
import Application from 'application/src/Application.jsx';

import 'common/asset/scss/application.scss';

export default React.createClass({
    render: function() {
        return  <div>
                    <h1>Hello YourTurn!</h1>
                    <Application />
                </div>;
    }
});