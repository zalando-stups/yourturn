import React from 'react';
import Icon from 'react-fa';
import {Link} from 'react-router';
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
        this.stores = {
            user: props.globalFlux.getStore('user'),
            kio: props.flux.getStore('kio'),
            twintip: props.flux.getStore('twintip')
        };
        this._forceUpdate = this.forceUpdate.bind(this);
        this.stores.user.on('change', this._forceUpdate);
    }

    componentWillUnmount() {
        this.stores.user.off('change', this._forceUpdate);
    }

    render() {
        let {applicationId} = this.props,
            {kio, twintip, user} = this.stores,
            versions = _.take(kio.getApplicationVersions(applicationId), 3),
            app = kio.getApplication(applicationId),
            isOwnApplication = determineOwnApplication(app, user.getTeamMemberships()),
            api = twintip.getApi(applicationId);

        const LINK_PARAMS = {
            applicationId: applicationId
        };

        if (app instanceof FetchResult) {
            return app.isPending() ?
                    <Placeholder
                        applicationId={applicationId} /> :
                    <DefaultError error={app.getResult()} />;
        }
        return <div className='applicationDetail'>
                    <h1>{app.name}</h1>
                    <div className='btn-group'>
                        <Link
                            to='application-appList'
                            className='btn btn-default'>
                            <Icon name='chevron-left' /> Applications
                        </Link>
                        <Link
                            to='application-appEdit'
                            className={`btn btn-default ${isOwnApplication ? '' : 'btn-disabled'}`}
                            params={LINK_PARAMS}>
                            <Icon name='pencil' /> Edit {app.name}
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
                        {app.active ?
                            null
                            :
                            <span
                                data-block='inactive-badge'
                                className='applicationDetail-status'>
                                <Icon name='circle-o' size='lg' /> Inactive
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
                                    {api.status === 'SUCCESS' ?
                                        <a href={app.service_url + api.ui}>
                                            Version {api.version}
                                        </a>
                                        :
                                        <span>No API docs available.</span>
                                    }
                                </td>
                            </tr>
                            <tr>
                                <th>Required Approvers</th>
                                <td>{app.required_approvers}</td>
                            </tr>
                            <tr>
                                <th>Recently updated versions</th>
                                <td>
                                    {versions.length ?
                                        versions.map(
                                            v => <div key={v.id}>
                                                    <Link
                                                        to='application-verApproval'
                                                        className='btn btn-default btn-small'
                                                        params={{
                                                            applicationId: applicationId,
                                                            versionId: v.id
                                                        }}>
                                                        <Icon name='check' />
                                                    </Link> <Link
                                                        to='application-verDetail'
                                                        params={{
                                                            applicationId: applicationId,
                                                            versionId: v.id
                                                        }}>
                                                        {v.id}
                                                    </Link>
                                                 </div>)
                                        :
                                        <div>No versions yet.</div>
                                    }
                                    <Link
                                        to='application-verCreate'
                                        params={LINK_PARAMS}
                                        className={`btn btn-default applicationDetail-newVersion ${isOwnApplication ? '' : 'btn-disabled'}`}>
                                        <Icon name='plus' /> New version
                                    </Link>
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
ApplicationDetail.displayName = 'ApplicationDetail';
ApplicationDetail.propTypes = {
    applicationId: React.PropTypes.string.isRequired
};
ApplicationDetail.contextTypes = {
    router: React.PropTypes.func.isRequired
};
export default ApplicationDetail;