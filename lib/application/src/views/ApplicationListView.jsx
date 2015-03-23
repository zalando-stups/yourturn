import React from 'react';
import {Link} from 'react-router';

let Placeholder = React.createClass({
    render: function() {
        return  <ul className='applicationList u-placeholder'>
                    <li>Thing</li>
                    <li>Thing</li>
                    <li>Thing</li>
                </ul>;
    }
});

export default React.createClass({
    propTypes: {
        applications: React.PropTypes.array.isRequired
    },
    render: function() {
        var apps = this.props.applications.toList().toJS();
        if (!apps.length) {
            return <Placeholder />;
        }
        return  <ul className='applicationList'>
                    {apps.map( app =>
                        <li>
                            <Link
                                to='application-detail'
                                params={{id: app.id}}
                                key={app.id}>{app.name}</Link>
                        </li>
                    )}
                </ul>;
    }
});