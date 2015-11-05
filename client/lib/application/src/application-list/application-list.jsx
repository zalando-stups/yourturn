import React from 'react';
import Icon from 'react-fa';
import {Link} from 'react-router';
import _ from 'lodash';
import 'common/asset/less/application/application-list.less';

class ApplicationList extends React.Component {
    constructor(props) {
        super();
        this.stores = {
            kio: props.kioStore,
            user: props.userStore
        };
        this.state = {
            term: '',
            showCount: 20,
            showAll: false,
            showInactive: false
        };
    }


    showAll() {
        this.setState({
            showAll: true
        });
    }

    filter(evt) {
        this.setState({
            term: evt.target.value
        });
    }

    updateShowInactive(id) {
        this.setState({
            showInactive: !this.state.showInactive
        });
    }

    render() {
        let {term, showCount, showAll, showInactive} = this.state,
            apps = this.stores.kio.getApplications(term),
            fetchStatus = this.stores.kio.getApplicationsFetchStatus(),
            userAccIds = _.pluck(this.stores.user.getUserCloudAccounts(), 'name'),
            otherApps = apps.filter(app => userAccIds.indexOf(app.team_id) < 0),
            teamApps = apps.filter(app => userAccIds.indexOf(app.team_id) >= 0),
            shortApps = !showAll && otherApps.length > showCount ? _.slice(otherApps, 0, showCount) : otherApps,
            remainingAppsCount = otherApps.length - showCount,
            latestVersions = teamApps.map(app => this.stores.kio.getLatestApplicationVersion(app.id));

        return <div className='applicationList'>
                    <h2 className='applicationList-headline'>Applications</h2>
                    <div className='btn-group'>
                        <Link
                            to='application-appCreate'
                            className='btn btn-primary'>
                            <Icon name='plus' /> Create Application
                        </Link>
                    </div>
                    <div className='form'>
                        <label htmlFor='yourturn-search'>Search:</label>
                        <div className='input-group'>
                            <div
                                className='input-addon'>
                                <Icon name='search' />
                            </div>
                            <input
                                name='yourturn_search'
                                autoFocus={true}
                                value={term}
                                onChange={this.filter.bind(this)}
                                type='search'
                                aria-label='Enter your term'
                                placeholder='Kio' />
                        </div>
                        <label>
                            <input type='checkbox'
                                   checked={showInactive}
                                   onChange={this.updateShowInactive.bind(this)}>
                            </input> show inactive
                        </label>
                    </div>
                    <h4>Your Applications {fetchStatus !== false && fetchStatus.isPending() ?
                                            <Icon name='circle-o-notch u-spinner' spin /> :
                                            null}</h4>
                    {teamApps.length ?
                        <table className='table'>
                            <colgroup>
                                <col width='50%' />
                                <col width='0*' />
                                <col width='50%' />
                                <col width='0*' />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>Application</th>
                                    <th>Team</th>
                                    <th>Latest version</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody data-block='team-apps'>
                            {teamApps.filter(
                                (ta, i) => (!ta.active && showInactive) || ta.active ).map(
                                (ta, i) =>
                                    <tr key={ta.id}
                                        className={'app ' + (ta.active ? '' : 'is-inactive')}>
                                        <td>
                                            <Link
                                                to='application-appDetail'
                                                params={{
                                                    applicationId: ta.id
                                                }}>
                                                {ta.name}
                                            </Link>
                                        </td>
                                        <td>{ta.team_id}</td>
                                        <td>
                                        {latestVersions[i] ?
                                            <div>
                                                {ta.active ?
                                                    <Link
                                                        className='btn btn-default btn-small applicationList-approvalButton'
                                                        title={'Approve version ' + latestVersions[i].id + ' of ' + ta.name}
                                                        to='application-verApproval'
                                                        params={{
                                                            versionId: latestVersions[i].id,
                                                            applicationId: ta.id
                                                        }}> <Icon name='check' />
                                                    </Link>
                                                    :
                                                    null}
                                                 <Link
                                                    to='application-verDetail'
                                                    params={{
                                                        versionId: latestVersions[i].id,
                                                        applicationId: ta.id
                                                    }}>
                                                    {latestVersions[i].id}
                                                </Link>
                                            </div>
                                            :
                                            null}
                                        </td>
                                        <td>
                                            {ta.active ?
                                                <Link
                                                    className='btn btn-default btn-small'
                                                    to='application-verCreate'
                                                    title={'Create new version for ' + ta.name}
                                                    params={{applicationId: ta.id}}>
                                                    <Icon name='plus' />
                                                </Link>
                                                :
                                                null}
                                        </td>
                                    </tr>
                            )}
                            </tbody>
                        </table>
                        :
                        <span>No applications owned by your team.</span>
                    }
                    <h4>Other Applications {fetchStatus !== false && fetchStatus.isPending() ?
                                                <Icon name='circle-o-notch u-spinner' spin /> :
                                                null}</h4>
                    {otherApps.length ?
                        <table className='table'>
                            <colgroup>
                                <col width='100%' />
                                <col width='0*' />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>Application</th>
                                    <th>Team</th>
                                </tr>
                            </thead>
                            <tbody data-block='other-apps'>
                                {shortApps.filter(
                                    (ta, i) => (!ta.active && showInactive) || ta.active ).map(
                                    other =>
                                        <tr key={other.id}
                                            className={'app ' + (other.active ? '' : 'is-inactive')}>
                                            <td>
                                                <Link
                                                    to='application-appDetail'
                                                    params={{
                                                        applicationId: other.id
                                                    }}>
                                                    {other.name}
                                                </Link>
                                            </td>
                                            <td>{other.team_id}</td>
                                        </tr>
                                )}
                            </tbody>
                        </table>
                        :
                        <span>No applications owned by other teams.</span>
                    }
                    {!showAll && !term.length && remainingAppsCount > 0 ?
                        <div className='btn-group'>
                            <div
                                onClick={this.showAll.bind(this)}
                                className='btn btn-default'>
                                Display remaining {remainingAppsCount} {remainingAppsCount > 1 ? 'applications' : 'application'}
                            </div>
                        </div>
                        :
                        null
                    }
                </div>;
    }
}
ApplicationList.displayName = 'ApplicationList';

export default ApplicationList;
