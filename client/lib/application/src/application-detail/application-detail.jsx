import React from 'react';
import _ from 'lodash';
import Markdown from 'common/src/markdown.jsx';
import FetchResult from 'common/src/fetch-result';
import Placeholder from './placeholder.jsx';
import DefaultError from 'common/src/error.jsx';
import 'common/asset/less/application/application-detail.less';

function determineOwnApplication(app, teams) {
    return teams
            .some(t => t.id === app.team_id);
}

class ApplicationDetail extends React.Component {
    constructor(props) {
        super();
        this.placeholder = <Placeholder applicationId={props.applicationId} />;
        this.stores = {
            user: props.globalFlux.getStore('user'),
            kio: props.flux.getStore('kio'),
            twintip: props.flux.getStore('twintip')
        };
    }

    render() {
        let {applicationId} = this.props,
            {kio, twintip, user} = this.stores,
            versions = _.take(kio.getApplicationVersions(applicationId), 3),
            app = kio.getApplication(applicationId),
            isOwnApplication = determineOwnApplication(app, user.getUserTeams()),
            api = twintip.getApi(applicationId);

        if (app instanceof FetchResult) {
            return app.isPending() ?
                    this.placeholder :
                    <DefaultError error={app.getResult()} />;
        }
        return  <div className='applicationDetail'>
                    <h1>{app.name}</h1>
                    <div className='btn-group'>
                        <a href='/application' className='btn btn-default'>
                            <i className='fa fa-chevron-left'></i> Applications
                        </a>
                        <a href={`/application/edit/${applicationId}`} className={`btn btn-default ${isOwnApplication ? '' : 'btn-disabled'}`}>
                            <i className='fa fa-pencil'></i> Edit {app.name}
                        </a>
                        <a href={`/application/oauth/${applicationId}`} className='btn btn-default'>
                            <i className='fa fa-plug'></i> OAuth Client
                        </a>
                        <a href={`/application/access-control/${applicationId}`} className='btn btn-default'>
                            <i className='fa fa-key'></i> Access Control
                        </a>
                        <a href={`/application/detail/${applicationId}/version`} className='btn btn-primary'>
                            <i className='fa fa-list'></i> Versions
                        </a>
                    </div>

                    <h4>
                        {app.active ?
                            null
                            :
                            <span
                                data-block='inactive-badge'
                                className='applicationDetail-status'>
                                <i className='fa fa-lg fa-circle-o'></i> Inactive
                            </span>
                        }
                        { app.subtitle }
                    </h4>

                    <table className='table'>
                        <tbody>
                            <tr>
                                <th>ID</th>
                                <td>{app.id}</td>
                            </tr>
                            <tr>
                                <th>Team ID</th>
                                <td>{app.team_id}</td>
                            </tr>
                            <tr>
                                <th>URL</th>
                                <td>
                                    <a href={app.service_url}>
                                        {app.service_url}
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <th>SCM</th>
                                <td>
                                    <a href={app.scm_url}>
                                        {app.scm_url}
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <th>Specification</th>
                                <td>
                                    <a href={app.specification_url}>
                                        {app.specification_url}
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <th>Documentation</th>
                                <td>
                                    <a href={app.documentation_url}>
                                        {app.documentation_url}
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <th>API</th>
                                <td>
                                    {api ?
                                        <a href={app.service_url + api.ui}>
                                            Version {api.version}
                                        </a>:
                                        <span>No API docs available.</span>
                                    }
                                </td>
                            </tr>
                            <tr>
                                <th>Recently updated versions</th>
                                <td>
                                    {versions.length ?
                                        versions.map(
                                            v => <div key={v.id}>
                                                    <a  title={`Approve version ${v.id}`}
                                                        className='btn btn-default btn-small'
                                                        href={`/application/detail/${app.id}/version/approve/{v.id}`}>
                                                        <i className='fa fa-check'></i>
                                                    </a> <a href={`/application/detail/${app.id}/version/detail/{v.id}`}>
                                                            {v.id}
                                                        </a>
                                                 </div>)
                                        :
                                        <div>No versions yet.</div>
                                    }
                                    <a  className={`btn btn-default applicationDetail-newVersion ${isOwnApplication ? '' : 'btn-disabled'}`}
                                        href={`/application/detail/${applicationId}/version/create`}>
                                        <i className='fa fa-plus'></i> New version
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <h4 className='applicationDetail-descriptionTitle'>Description</h4>
                    <Markdown
                        className='applicationDetail-description'
                        block='description'
                        src={app.description} />
                </div>;
    }
}

export default ApplicationDetail;