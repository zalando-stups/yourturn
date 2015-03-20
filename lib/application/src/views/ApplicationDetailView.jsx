import React from 'react';

import 'common/asset/scss/application/application-detail.scss';

/**
 * Placeholder element for a single application.
 */
let Placeholder = React.createClass({
    render: function() {
        return  <div className="applicationDetail u-placeholder">
                    <h1>Placeholder</h1>
                    <table>
                        <tbody>
                            <tr>
                                <th>id</th>
                                <td>nonsense</td>
                            </tr>
                            <tr>
                                <th>team_id</th>
                                <td>nonsense</td>
                            </tr>
                            <tr>
                                <th>url</th>
                                <td>
                                    nonsense
                                </td>
                            </tr>
                            <tr>
                                <th>scm_url</th>
                                <td>nonsense</td>
                            </tr>
                            <tr>
                                <th>documentation_url</th>
                                <td>placeholder</td>
                            </tr>
                        </tbody>
                    </table>
                </div>;
    }
});

/**
 * The real ApplicationDetail component.
 */
export default React.createClass({
    propTypes: {
        applications: React.PropTypes.array.isRequired,
        application: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ])
    },
    render: function() {
        var app = this.props.applications.get(this.props.application);
        if (!app) {
            return <Placeholder />;
        }

        return  <div className="applicationDetail">
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