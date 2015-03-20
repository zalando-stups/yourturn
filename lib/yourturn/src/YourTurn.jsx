import React from 'react';
import Sidebar from 'common/src/Sidebar.jsx';
import Application from 'application/src/Application.jsx';


import 'common/asset/scss/yourturn/yourturn.scss';

export default React.createClass({
    render: function() {
        return  <div className="yourturn">
                    <Sidebar>
                        Application
                    </Sidebar>
                    <Application />
                </div>;
    }
});