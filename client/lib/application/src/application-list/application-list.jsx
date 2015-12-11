/* global ENV_TEST */
import React from 'react';
import Icon from 'react-fa';
import AccountAppList from './account-app-list.jsx';
import {Tabs, TabPanel, TabList, Tab} from 'react-tabs';
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
        this.actions = props.kioActions;
        let prefAccount = props.kioStore.getPreferredAccount(),
            userAccIds = _.pluck(props.userStore.getUserCloudAccounts(), 'name').sort();

        this.state = {
            term: '',
            showCount: 20,
            showAll: false,
            showInactive: false,
            userAccIds,
            selectedTab: userAccIds.indexOf(props.kioStore.getPreferredAccount()) || 0
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

    updateShowInactive() {
        this.setState({
            showInactive: !this.state.showInactive
        });
    }

    _selectTab(tab) {
        let account = this.state.userAccIds[tab];
        this.actions.savePreferredAccount(account);
        this.actions.fetchLatestApplicationVersions(account);
        this.setState({
            selectedTab: tab
        });
    }

    render() {
        let {term, showCount, showAll, showInactive, userAccIds} = this.state,
            apps = this.stores.kio.getApplications(),
            fetchStatus = this.stores.kio.getApplicationsFetchStatus(),
            otherApps = apps.filter(app => userAccIds.indexOf(app.team_id) < 0),
            shortApps = !showAll && otherApps.length > showCount ? _.slice(otherApps, 0, showCount) : otherApps,
            remainingAppsCount = otherApps.length - showCount;

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
                            <input data-block='show-inactive-checkbox' type='checkbox'
                                   checked={showInactive}
                                   onChange={this.updateShowInactive.bind(this)}>
                            </input> show inactive
                        </label>
                    </div>
                    <h4>Your Applications {fetchStatus !== false && fetchStatus.isPending() ?
                                            <Icon name='circle-o-notch u-spinner' spin /> :
                                            null}</h4>
                    {!ENV_TEST ?
                        <Tabs
                            onSelect={this._selectTab.bind(this)}
                            selectedIndex={this.state.selectedTab}>
                            <TabList>
                                {userAccIds.map(acc => <Tab>{acc}</Tab>)}
                            </TabList>
                            {userAccIds.map(acc => <TabPanel>
                                                        <AccountAppList
                                                            account={acc}
                                                            search={term}
                                                            showInactive={showInactive}
                                                            kioStore={this.stores.kio} />
                                                    </TabPanel>)}
                        </Tabs>
                        :
                        null
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
                                    (ta) => (!ta.active && showInactive) || ta.active ).map(
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
                                            <td><div className='team'>{other.team_id}</div></td>
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
