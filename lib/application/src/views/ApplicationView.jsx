import React from 'react';

var Placeholder = React.createClass({
    render: function() {
        return  <div className="application" dataPlaceholder>
                    <h1>Placeholder</h1>
                </div>;
    }
});

export default React.createClass({
    render: function() {
        var app = this.props.applications.get(this.props.application);
        if (!app) {
            return <Placeholder />;
        }

        return  <div className="application">
                    <h1>{app.get('name')}</h1>
                    <table>
                        <tbody>
                            <tr>
                                <th>id</th>
                                <td>{app.get('id')}</td>
                            </tr>
                            <tr>
                                <th>team_id</th>
                                <td>{app.get('team_id')}</td>
                            </tr>
                            <tr>
                                <th>url</th>
                                <td>
                                    <a href={app.get('url')}>
                                        {app.get('url')}
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <th>scm_url</th>
                                <td>{app.get('scm_url')}</td>
                            </tr>
                            <tr>
                                <th>documentation_url</th>
                                <td>
                                    <a href={app.get('documentation_url')}>
                                        {app.get('documentation_url')}
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <h4>Description</h4>
                    <p>
                        {app.get('description')}
                    </p>
                </div>;
    }
});