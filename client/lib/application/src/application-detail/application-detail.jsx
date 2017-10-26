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

export default function ApplicationDetail({applicationId, application, editable, api}) {
    const LINK_PARAMS = { applicationId };

    if (application instanceof FetchResult) {
        return application.isPending() ?
                <Placeholder applicationId={applicationId} /> :
                <DefaultError error={application.getResult()} />;
    }

    return <div className='applicationDetail'>
                <h1>{application.name || applicationId}</h1>
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

