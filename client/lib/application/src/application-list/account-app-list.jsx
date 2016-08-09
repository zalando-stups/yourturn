import React from 'react';
import Icon from 'react-fa';
import {Link} from 'react-router';
import * as Routes from 'application/src/routes';

const AccountAppList = (props) => {
    let {account, kioStore, showInactive, search} = props,
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
                        <tbody data-block='apps'>
                        {
                            apps
                            .filter(ta => (!ta.active && showInactive) || ta.active)
                            .map(
                                ta =>
                                <tr key={ta.id}
                                    data-block='app'
                                    className={'app ' + (ta.active ? '' : 'is-inactive')}>
                                    <td>
                                        <Link
                                            to={Routes.appDetail({
                                                applicationId: ta.id
                                            })}>
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
                                                    to={Routes.verApproval({
                                                        versionId: latestVersions[ta.id],
                                                        applicationId: ta.id
                                                    })}> <Icon name='check' />
                                                </Link>
                                                :
                                                null}
                                             <Link
                                                to={Routes.verDetail({
                                                    versionId: latestVersions[ta.id],
                                                    applicationId: ta.id
                                                })}>
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
                                                to={Routes.verCreate({
                                                    applicationId: ta.id
                                                })}
                                                title={'Create new version for ' + ta.name}>
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
};

AccountAppList.displayName = 'AccountAppList';

// TODO be more specific
AccountAppList.propTypes = {
    account: React.PropTypes.string,
    kioStore: React.PropTypes.shape({
        getApplications: React.PropTypes.func,
        getLatestApplicationVersions: React.PropTypes.func
    }).isRequired,
    search: React.PropTypes.string,
    showInactive: React.PropTypes.bool
}

export default AccountAppList;
