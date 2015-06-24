import React from 'react';
import Icon from 'react-fa';
import {Link} from 'react-router';

class ApplicationDetailPlaceholder extends React.Component {
    constructor() {
        super();
    }

    render() {
        let {applicationId} = this.props;
        const LINK_PARAMS = {
            applicationId: applicationId
        };
        return <div className='applicationDetail u-placeholder'>
                    <h1>{{applicationId}}</h1>

                    <div className='btn-group'>
                        <Link
                            to='application-appList'
                            className='btn btn-default'>
                            <Icon name='chevron-left' /> Applications
                        </Link>
                        <Link
                            to='application-appEdit'
                            className='btn btn-default btn-disabled'
                            params={LINK_PARAMS}>
                            <Icon name='pencil' /> Edit {applicationId}
                        </Link>
                        <Link
                            to='application-appOAuth'
                            className='btn btn-default'
                            params={LINK_PARAMS}>
                            <Icon name='plug' /> OAuth Client
                        </Link>
                        <Link
                            to='application-appAccess'
                            className='btn btn-default'
                            params={LINK_PARAMS}>
                            <Icon name='key' /> Access Control
                        </Link>
                        <Link
                            to='application-verList'
                            className='btn btn-primary'
                            params={LINK_PARAMS}>
                            <Icon name='list' /> Versions
                        </Link>
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
                                <th>Required Approvers</th>
                                <td className='u-placeholder-text'>1</td>
                            </tr>
                            <tr>
                                <th>Recently updated versions</th>
                                <td>
                                    <div>
                                        <a className='btn btn-disabled btn-small'>
                                            <Icon name='check' />
                                        </a> <span className='u-placeholder-text'>0.1</span>
                                    </div>
                                    <div>
                                        <a className='btn btn-disabled btn-small'>
                                            <Icon name='check' />
                                        </a> <span className='u-placeholder-text'>0.1</span>
                                    </div>
                                    <div>
                                        <a className='btn btn-disabled btn-small'>
                                            <Icon name='check' />
                                        </a> <span className='u-placeholder-text'>0.1</span>
                                    </div>

                                    <Link
                                        to='application-verCreate'
                                        params={LINK_PARAMS}
                                        className='btn btn-default applicationDetail-newVersion btn-disabled'>
                                        <Icon name='plus' /> New version
                                    </Link>
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
ApplicationDetailPlaceholder.displayName = 'ApplicationDetailPlaceholder';
ApplicationDetailPlaceholder.propTypes = {
    applicationId: React.PropTypes.string.isRequired
};
ApplicationDetailPlaceholder.contextTypes = {
    router: React.PropTypes.func.isRequired
};
export default ApplicationDetailPlaceholder;