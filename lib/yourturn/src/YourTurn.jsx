import React from 'react';
import Sidebar from 'common/src/Sidebar.jsx';
import {Link, RouteHandler} from 'react-router';

import 'common/asset/scss/yourturn/yourturn.scss';

export default React.createClass({
    render: function() {
        return  <div className="yourturn">
                    <Sidebar>
                        <Link to="application">
                            Applications
                        </Link>
                    </Sidebar>
                    <div className="yourturn-view">
                        <RouteHandler />
                    </div>
                </div>;
    }
});