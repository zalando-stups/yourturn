import React from 'react';

class ApplicationDetailPlaceholder extends React.Component {
    constructor() {
        super();
    }

    render() {
        let {applicationId} = this.props;
        return <div className='applicationDetail u-placeholder'>
                    <h1>{{applicationId}}</h1>

                    <div className='btn-group'>
                        <a href='/application' className='btn btn-default'>
                            <i className='fa fa-chevron-left'></i> Applications
                        </a>
                        <a href='/application/edit/{{applicationId}}' className='btn btn-default btn-disabled'>
                            <i className='fa fa-pencil'></i> Edit {{applicationId}}
                        </a>
                        <a href='/application/oauth/{{applicationId}}' className='btn btn-default'>
                            <i className='fa fa-plug'></i> OAuth Client
                        </a>
                        <a href='/application/access-control/{{applicationId}}' className='btn btn-default'>
                            <i className='fa fa-key'></i> Access Control
                        </a>
                        <a href='/application/detail/{{applicationId}}/version' className='btn btn-primary'>
                            <i className='fa fa-list'></i> Versions
                        </a>
                    </div>

                    <h4>
                        <span className='u-placeholder-text'>subtitle</span>
                    </h4>

                    <table className='table'>
                        <tbody>
                            <tr>
                                <th>ID</th>
                                <td className='u-placeholder-text'>appid</td>
                            </tr>
                            <tr>
                                <th>Team ID</th>
                                <td className='u-placeholder-text'>teamid</td>
                            </tr>
                            <tr>
                                <th>URL</th>
                                <td className='u-placeholder-text'>
                                    verylongservice
                                </td>
                            </tr>
                            <tr>
                                <th>SCM</th>
                                <td className='u-placeholder-text'>
                                    verylongsourcecode
                                </td>
                            </tr>
                            <tr>
                                <th>Specification</th>
                                <td className='u-placeholder-text'>
                                    verlongissues
                                </td>
                            </tr>
                            <tr>
                                <th>Documentation</th>
                                <td className='u-placeholder-text'>
                                    verylongdocs
                                </td>
                            </tr>
                            <tr>
                                <th>API</th>
                                <td className='u-placeholder-text'>
                                    apidocumentation
                                </td>
                            </tr>
                            <tr>
                                <th>Recently updated versions</th>
                                <td>
                                    <div>
                                        <a className='btn btn-disabled btn-small'>
                                            <i className='fa fa-check'></i>
                                        </a> <span className='u-placeholder-text'>0.1</span>
                                    </div>
                                    <div>
                                        <a className='btn btn-disabled btn-small'>
                                            <i className='fa fa-check'></i>
                                        </a> <span className='u-placeholder-text'>0.1</span>
                                    </div>
                                    <div>
                                        <a className='btn btn-disabled btn-small'>
                                            <i className='fa fa-check'></i>
                                        </a> <span className='u-placeholder-text'>0.1</span>
                                    </div>

                                    <a className='btn btn-default btn-disabled applicationDetail-newVersion'
                                        href='/application/detail/{{applicationId}}/version/create'>
                                        <i className='fa fa-plus'></i> New version
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <h4 className='applicationDetail-descriptionTitle'>Description</h4>
                    <p className='u-placeholder-text'>
                        This is a short description of the application.
                    </p>
                </div>;
    }
}

export default ApplicationDetailPlaceholder;