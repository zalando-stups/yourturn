import React from 'react';
import Icon from 'react-fa';
import {Link} from 'react-router';

class AccountAppList extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        let {account, kioStore, showInactive, search} = this.props,
            apps = kioStore.getApplications(search, account),
            latestVersions = kioStore.getLatestApplicationVersions(account);

        return <div className='teamAppList'>
                    {apps.length ?
                        <table className='table'>
                            <colgroup>
                                <col width='60%' />
                                <col width='40%' />
                                <col width='0*' />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>Application</th>
                                    <th>Latest&nbsp;version</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody data-block='team-apps'>
                            {
                                apps
                                .filter(ta => (!ta.active && showInactive) || ta.active)
                                .map(
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
                                        <td>
                                        {latestVersions[ta.id] ?
                                            <div>
                                                {ta.active ?
                                                    <Link
                                                        className='btn btn-default btn-small applicationList-approvalButton'
                                                        title={'Approve version ' + latestVersions[ta.id] + ' of ' + ta.name}
                                                        to='application-verApproval'
                                                        params={{
                                                            versionId: latestVersions[ta.id],
                                                            applicationId: ta.id
                                                        }}> <Icon name='check' />
                                                    </Link>
                                                    :
                                                    null}
                                                 <Link
                                                    to='application-verDetail'
                                                    params={{
                                                        versionId: latestVersions[ta.id],
                                                        applicationId: ta.id
                                                    }}>
                                                    {latestVersions[ta.id]}
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
                        <span>No applications for team {account}.</span>}
                </div>;
    }
}

export default AccountAppList;
