import React from 'react';
import Icon from 'react-fa';
import {Link} from 'react-router';
import * as Routes from 'application/src/routes';
import _ from 'lodash';
import Markdown from 'common/src/markdown.jsx';
import FetchResult from 'common/src/fetch-result';
import Placeholder from './placeholder.jsx';
import DefaultError from 'common/src/error.jsx';
import 'common/asset/less/application/application-detail.less';
import Config from 'common/src/config';

function isWhitelisted(uid) {
    if (Config.APPLICATION_WHITELIST.length === 0) {
        return true;
    }
    return uid && Config.APPLICATION_WHITELIST.indexOf(uid) >= 0;
}

function determineOwnApplication(app, accounts) {
    return accounts.some(t => t.name === app.team_id);
}

class ApplicationDetail extends React.Component {
    constructor(props) {
        super();
        this.state = {
            criticalityUpdatePending: false
        };
    }

    onUpdateCriticality(app, amount) {
        this.setState({
            criticalityUpdatePending: true
        });

        this.props.kioActions
        .saveApplicationCriticality(app.id, app.criticality_level + amount)
        .then(() => {
            this.props.kioActions.fetchApplication(app.id);
            this.setState({
                criticalityUpdatePending: false
            });
        })
        .catch(err => {
            this.props.notificationActions
            .addNotification(
                `Could not update criticality of ${app.name}. ${err}`,
                'error'
            );
            this.setState({
                criticalityUpdatePending: true
            });
        });
    }

    render() {
        let {applicationId} = this.props,
            {uid} = this.props.userStore.getTokenInfo(),
            versions = _.take(this.props.kioStore.getApplicationVersions(applicationId), 3),
            app = this.props.kioStore.getApplication(applicationId),
            {criticality_level} = app,
            isOwnApplication = determineOwnApplication(app, this.props.userStore.getUserCloudAccounts()),
            api = this.props.twintipStore.getApi(applicationId);

        const LINK_PARAMS = {
            applicationId: applicationId
        };

        if (app instanceof FetchResult) {
            return app.isPending() ?
                    <Placeholder applicationId={applicationId} /> :
                    <DefaultError error={app.getResult()} />;
        }
        return <div className='applicationDetail'>
                    <h1>{app.name}</h1>
                    <div className='btn-group'>
                        <Link
                            to={Routes.appList(LINK_PARAMS)}
                            className='btn btn-default'>
                            <Icon name='chevron-left' /> Applications
                        </Link>
                        <Link
                            to={Routes.appEdit(LINK_PARAMS)}
                            className={`btn btn-default ${isOwnApplication ? '' : 'btn-disabled'}`}>
                            <Icon name='pencil' /> Edit {app.name}
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
                        <Link
                            to={Routes.verList(LINK_PARAMS)}
                            className='btn btn-primary'>
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
                        {app.publicly_accessible ?
                            <span
                                title={'Root path can be accessed without credentials'}
                                data-block='public-badge'
                                className='applicationDetail-public'>
                                <Icon name='globe' size='lg' /> Public
                            </span>
                            :
                            null}
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
                                <th>Documentation</th>
                                <td>
                                    <a href={app.documentation_url}>
                                        {app.documentation_url}
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
                                <th>Specification Type</th>
                                <td>
                                    {app.specification_type}
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
                                <th>Criticality Level</th>
                                <td>{isWhitelisted(uid) ?
                                        <div className='btn btn-default btn-small'
                                             data-block='decrease-criticality-button'
                                             title='Decrease criticality by one'
                                             role='button'
                                             onClick={this.onUpdateCriticality.bind(this, app, -1)}
                                             disabled={criticality_level === 1}>
                                            <Icon name='minus' />
                                        </div>
                                        :
                                        null
                                } {this.state.criticalityUpdatePending ?
                                        <Icon
                                            spin
                                            className='applicationDetail-criticality u-spinner'
                                            name='circle-o-notch' />
                                        :
                                        <span className='applicationDetail-criticality'
                                              data-criticality={app.criticality_level}>
                                            {app.criticality_level}
                                        </span>
                                    } {isWhitelisted(uid) ?
                                        <div className='btn btn-default btn-small'
                                             data-block='increase-criticality-button'
                                             title='Increase criticality by one'
                                             role='button'
                                             onClick={this.onUpdateCriticality.bind(this, app, 1)}
                                             disabled={criticality_level === 3}>
                                            <Icon name='plus' />
                                        </div>
                                        :
                                        null
                                }</td>
                            </tr>
                            <tr>
                                <th>Recently updated versions</th>
                                <td>
                                    {versions.length ?
                                        versions.map(
                                            v => <div key={v.id}>
                                                    <Link
                                                        to={Routes.verApproval({
                                                            applicationId: applicationId,
                                                            versionId: v.id
                                                        })}
                                                        className='btn btn-default btn-small'>
                                                        <Icon name='check' />
                                                    </Link> <Link
                                                        to={Routes.verDetail({
                                                            applicationId: applicationId,
                                                            versionId: v.id
                                                        })}>
                                                        {v.id}
                                                    </Link>
                                                 </div>)
                                        :
                                        <div>No versions yet.</div>
                                    }
                                    <Link
                                        to={Routes.verCreate(LINK_PARAMS)}
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
    applicationId: React.PropTypes.string.isRequired,
    notificationActions: React.PropTypes.object.isRequired,
    kioActions: React.PropTypes.object.isRequired,
    userStore: React.PropTypes.object.isRequired,
    kioStore: React.PropTypes.object.isRequired,
    twintipStore: React.PropTypes.object.isRequired
};
export default ApplicationDetail;
