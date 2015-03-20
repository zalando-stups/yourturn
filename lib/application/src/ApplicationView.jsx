import React from 'react';

export default React.createClass({
    render: function() {
        console.log('rendering app view', this.props);
        var app = this.props.applications.get(this.props.application);
        return <h1>{app ? app.get('name') : ''}</h1>;
    }
});