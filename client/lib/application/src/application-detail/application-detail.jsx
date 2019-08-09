/* global ENV_DEVELOPMENT */
import React from 'react';
import Icon from 'react-fa';
import {Link} from 'react-router';
import * as Routes from 'application/src/routes';
import Markdown from 'common/src/markdown.jsx';
import FetchResult from 'common/src/fetch-result';
import Placeholder from './placeholder.jsx';
import DefaultError from 'common/src/error.jsx';
import 'common/asset/less/application/application-detail.less';
import APPLICATION_BASE_URL from 'APPLICATION_BASE_URL';
import APPLICATION_LINK_TITLE from 'APPLICATION_LINK_TITLE';

export default function ApplicationDetail({applicationId, application, editable, api}) {
    const LINK_PARAMS = { applicationId };

    if (application instanceof FetchResult) {
        return application.isPending() ?
                <Placeholder applicationId={applicationId} /> :
                <DefaultError error={application.getResult()} />;
    }

    return <div className='applicationDetail'>
                <h1>
                    {APPLICATION_BASE_URL && (
                        <a title={APPLICATION_LINK_TITLE} style={{textDecoration: 'none', backgroundImage: 'none'}} href={APPLICATION_BASE_URL + applicationId}>
                            <svg width='40' height='100%' viewBox='0 0 24 24'>
                                <path fill='#000000' d='M19,4C20.11,4 21,4.9 21,6V18A2,2 0 0,1 19,20H5C3.89,20 3,19.1 3,18V6A2,2 0 0,1 5,4H19M19,18V8H5V18H19Z' />
                            </svg>
                        </a>)}
                    {application.name || applicationId}
                </h1>
                <div className='btn-group'>
                    <Link
                        to={Routes.appList(LINK_PARAMS)}
                        className='btn btn-default'>
                        <Icon name='chevron-left' /> Applications
                    </Link>
                    <Link
                        to={Routes.appEdit(LINK_PARAMS)}
                        className={`btn btn-default ${editable ? '' : 'btn-disabled'}`}>
                        <Icon name='pencil' /> Edit {application.name || applicationId}
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
                    {ENV_DEVELOPMENT ?
                        <Link
                            to={Routes.lifecycle(LINK_PARAMS)}
                            className='btn btn-primary'>
                            <Icon name='bar-chart' /> Lifecycle
                        </Link>
                        : null
                    }
                </div>

                <h4>
                    {application.active ?
                        null
                        :
                        <span
                            data-block='inactive-badge'
                            className='applicationDetail-status'>
                            <Icon name='circle-o' size='lg' /> Inactive
                        </span>
                    }
                    {application.publicly_accessible ?
                        <span
                            title={'Root path can be accessed without credentials'}
                            data-block='public-badge'
                            className='applicationDetail-public'>
                            <Icon name='globe' size='lg' /> Public
                        </span>
                        :
                        null}
                    { application.subtitle }
                </h4>

                <table className='table'>
                    <tbody>
                        <tr>
                            <th>ID</th>
                            <td>{application.id}</td>
                        </tr>
                        <tr>
                            <th>Team ID</th>
                            <td>{application.team_id}</td>
                        </tr>
                        <tr>
                            <th>24x7 Incident Contact</th>
                            <td>{application.incident_contact}</td>
                        </tr>
                        <tr>
                            <th>URL</th>
                            <td>
                                <a href={application.service_url}>
                                    {application.service_url}
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <th>SCM</th>
                            <td>
                                <a href={application.scm_url}>
                                    {application.scm_url}
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <th>Documentation</th>
                            <td>
                                <a href={application.documentation_url}>
                                    {application.documentation_url}
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <th>Specification</th>
                            <td>
                                <a href={application.specification_url}>
                                    {application.specification_url}
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <th>Specification Type</th>
                            <td>
                                {application.specification_type}
                            </td>
                        </tr>
                        <tr>
                            <th>API</th>
                            <td>
                                {api.status === 'SUCCESS' ?
                                    <a href={application.service_url + api.ui}>
                                        Version {api.version}
                                    </a>
                                    :
                                    <span>No API docs available.</span>
                                }
                            </td>
                        </tr>
                        <tr>
                            <th>Criticality Level</th>
                            <td>
                                <span className='applicationDetail-criticality'
                                      data-criticality={application.criticality_level}>
                                        {application.criticality_level}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <h4 className='applicationDetail-descriptionTitle'>Description</h4>
                <Markdown
                    className='applicationDetail-description'
                    block='description'
                    src={application.description} />
            </div>;
}

ApplicationDetail.displayName = 'ApplicationDetail';
ApplicationDetail.propTypes = {
    api: React.PropTypes.shape({
        ui: React.PropTypes.string,
        version: React.PropTypes.string,
        status: React.PropTypes.string
    }).isRequired,
    application: React.PropTypes.object.isRequired,
    applicationId: React.PropTypes.string.isRequired,
    editable: React.PropTypes.bool,
    kioActions: React.PropTypes.object.isRequired,
    notificationActions: React.PropTypes.object.isRequired
};

