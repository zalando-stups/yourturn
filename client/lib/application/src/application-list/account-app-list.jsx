import React from 'react';
import {Link} from 'react-router';
import * as Routes from 'application/src/routes';

const AccountAppList = (props) => {
    let {account, kioStore, showInactive, search} = props,
        apps = kioStore.getApplications(search, account);

    return <div className='teamAppList'>
                {apps.length ?
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Application</th>
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
        getApplications: React.PropTypes.func
    }).isRequired,
    search: React.PropTypes.string,
    showInactive: React.PropTypes.bool
}

export default AccountAppList;
