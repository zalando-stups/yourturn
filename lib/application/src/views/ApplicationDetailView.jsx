import React from 'react';
import FetchResult from 'common/src/FetchResult';
import HttpError from 'common/src/HttpError.jsx';
import 'common/asset/scss/application/application-detail.scss';

/**
 * Placeholder element for a single application.
 */
let Placeholder = React.createClass({
    render: function() {
        return  <div className='applicationDetail u-placeholder'>
                    <h1 className='u-placeholder-text'>Placeholder</h1>
                    <table>
                        <tbody>
                            <tr>
                                <th>ID</th>
                                <td className='u-placeholder-text'>nonsense</td>
                            </tr>
                            <tr>
                                <th>Team ID</th>
                                <td className='u-placeholder-text'>nonsense</td>
                            </tr>
                            <tr>
                                <th>URL</th>
                                <td className='u-placeholder-text'>nonsense</td>
                            </tr>
                            <tr>
                                <th>SCM</th>
                                <td className='u-placeholder-text'>nonsense</td>
                            </tr>
                            <tr>
                                <th>Documentation</th>
                                <td className='u-placeholder-text'>placeholder</td>
                            </tr>
                        </tbody>
                    </table>
                    <h4 className='applicationDetail-descriptionTitle'>Description</h4>
                    <p className='u-placeholder-text'>
                        This is the description of the application.
                    </p>
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

        if (app instanceof FetchResult) {
            return app.isPending() ? <Placeholder/> : <HttpError error={app.getResult()} />;
        }

        return  <div className='applicationDetail'>
                    <h1>{app.get('name')}</h1>
                    <table>
                        <tbody>
                            <tr>
                                <th>ID</th>
                                <td>{app.get('id')}</td>
                            </tr>
                            <tr>
                                <th>Team ID</th>
                                <td>{app.get('team_id')}</td>
                            </tr>
                            <tr>
                                <th>URL</th>
                                <td>
                                    <a href={app.get('url')}>
                                        {app.get('url')}
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <th>SCM</th>
                                <td>{app.get('scm_url')}</td>
                            </tr>
                            <tr>
                                <th>Documentation</th>
                                <td>
                                    <a href={app.get('documentation_url')}>
                                        {app.get('documentation_url')}
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <h4 className='applicationDetail-descriptionTitle'>Description</h4>
                    <p>
                        {app.get('description')}
                    </p>
                </div>;
    }
});