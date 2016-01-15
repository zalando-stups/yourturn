import React from 'react';
import Icon from 'react-fa';
import {Link} from 'react-router';
import * as Routes from 'application/src/routes';
import 'common/asset/less/application/version-list.less';

class VersionList extends React.Component {
    constructor(props) {
        super();
        this.state = {
            term: ''
        };
    }

    filter(evt) {
        this.setState({
            term: evt.target.value
        });
    }

    render() {
        let {applicationId, kioStore, userStore} = this.props,
            application = kioStore.getApplication(applicationId),
            {term} = this.state,
            isOwnApplication = userStore.getUserCloudAccounts().some(t => t.name === application.team_id),
            versions = kioStore.getApplicationVersions(applicationId, term);
        const LINK_PARAMS = {
            applicationId: applicationId
        };
        return <div className='versionList'>
                    <h2>
                        <Link
                            to={Routes.appDetail(LINK_PARAMS)}>
                            {application.name || applicationId}
                        </Link> versions
                    </h2>
                    <div className='btn-group'>
                        <Link
                            to={Routes.appDetail(LINK_PARAMS)}
                            className='btn btn-default'>
                            <Icon name='chevron-left' /> {application.name || applicationId}
                        </Link>
                        <Link
                            to={Routes.verCreate(LINK_PARAMS)}
                            disabled={!isOwnApplication}
                            className='btn btn-primary'>
                            <Icon name='plus' /> Create new version
                        </Link>
                    </div>
                    <div className='form'>
                        <div className='input-group'>
                            <div
                                className='input-addon'>
                                <Icon name='search' />
                            </div>
                            <input
                                name='yourturn_version_search'
                                autoFocus={true}
                                value={term}
                                onChange={this.filter.bind(this)}
                                type='search'
                                aria-label='Enter your search term'
                                data-block='search-input'
                                placeholder='1.0-squirrel' />
                        </div>
                    </div>
                    {versions.length ?
                        <div
                            className='versionList-list'
                            data-block='versions'>
                                {versions.map(
                                    v =>
                                        <div key={v.id}>
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
                                        </div>)}
                        </div>
                        :
                        <div>No versions.</div>}
                </div>;
    }
}
VersionList.displayName = 'VersionList';
VersionList.propTypes = {
    applicationId: React.PropTypes.string.isRequired
};

export default VersionList;