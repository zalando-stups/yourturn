import React from 'react';
import {Link} from 'react-router';

export default React.createClass({
    render: function() {
        var apps = this.props.applications.toList().toJS();
        return  <ul className="applicationList">
                    {apps.map( app =>
                        <li>
                            <Link
                                to="application-detail"
                                params={{id: app.id}}
                                key={app.id}>{app.name}</Link>
                        </li>
                    )}
                </ul>;
    }
});