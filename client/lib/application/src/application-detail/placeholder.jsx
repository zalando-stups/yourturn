import React from 'react';
import Icon from 'react-fa';
import {Link} from 'react-router';
import * as Routes from 'application/src/routes';

const ApplicationDetailPlaceholder = (props) => {
    let {applicationId} = props;
    const LINK_PARAMS = {
        applicationId
    };
    return (<div className='applicationDetail u-placeholder'>
                <h1>{applicationId}</h1>

                <div className='btn-group'>
                    <Link
                        to={Routes.appList(LINK_PARAMS)}
                        className='btn btn-default'>
                        <Icon name='chevron-left' /> Applications
                    </Link>
                    <Link
                        to={Routes.appEdit(LINK_PARAMS)}
                        className='btn btn-default btn-disabled'>
                        <Icon name='pencil' /> Edit {applicationId}
                    </Link>
                    <Link
                        to={Routes.appOAuth(LINK_PARAMS)}
                        className='btn btn-default'>
                        <Icon name='plug' /> OAuth Client
                    </Link>
                    <Link
                        to={Routes.appAccess(LINK_PARAMS)}
                        className='btn btn-default'>
                        <Icon name='key' /> Access Control
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
                            <th>Documentation</th>
                            <td className='u-placeholder-text'>
                                verylongdocs
                            </td>
                        </tr>
                        <tr>
                            <th>Specification</th>
                            <td className='u-placeholder-text'>
                                verlongissues
                            </td>
                        </tr>
                        <tr>
                            <th>Support</th>
                            <td className='u-placeholder-text'>
                                verlongissues
                            </td>
                        </tr>
                        <tr>
                            <th>Specification Type</th>
                            <td className='u-placeholder-text'>
                                verlongissues
                            </td>
                        </tr>
                        <tr>
                            <th>API</th>
                            <td className='u-placeholder-text'>
                                apidocumentation
                            </td>
                        </tr>
                        <tr>
                            <th>Criticality Level / Tier</th>
                            <td className='u-placeholder-text'>1</td>
                        </tr>
                    </tbody>
                </table>
                <h4 className='applicationDetail-descriptionTitle'>Description</h4>
                <p className='u-placeholder-text'>
                    This is a short description of the application.
                </p>
            </div>)
};

ApplicationDetailPlaceholder.displayName = 'ApplicationDetailPlaceholder';

ApplicationDetailPlaceholder.propTypes = {
    applicationId: React.PropTypes.string.isRequired
};

export default ApplicationDetailPlaceholder;
