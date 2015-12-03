/* global ENV_TEST */
import React from 'react';
import Icon from 'react-fa';
import {Tabs, TabPanel, TabList, Tab} from 'react-tabs';
import {Link} from 'react-router';
import _ from 'lodash';
import 'common/asset/less/application/application-list.less';

class AccountAppList extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        let {account, kioStore, showInactive, search} = this.props,
            apps = kioStore.getApplications(search, account),
            latestVersions = kioStore.getLatestApplicationVersions(account);

        return <div className='accountAppList'>
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
                        {apps
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
                </div>;
    }
}

class ApplicationList extends React.Component {
    constructor(props) {
        super();
        this.stores = {
            kio: props.kioStore,
            user: props.userStore
        };
        this.actions = props.kioActions;
        let prefAccount = props.kioStore.getPreferredAccount(),
            userAccIds = _.pluck(props.userStore.getUserCloudAccounts(), 'name').sort(),
            inactiveVersionsFetched = userAccIds.reduce((prev, a) => {prev[a] = false; return prev;}, {});

        this.state = {
            term: '',
            showCount: 20,
            showAll: false,
            showInactive: false,
            inactiveVersionsFetched,
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
        // fetch versions for inactive apps
        let account = this.props.kioStore.getPreferredAccount(),
            {inactiveVersionsFetched} = this.state;
        if (!this.state.showInactive && !inactiveVersionsFetched[account]) {
            // fetch versions for our inactive apps
            this.stores.kio
                .getApplications(this.state.term, account)
                .filter(app => !app.active)
                .forEach(app => this.actions.fetchApplicationVersions(app.id));

            inactiveVersionsFetched[account] = true;
            this.setState({
                inactiveVersionsFetched
            });
        }
        this.setState({
            showInactive: !this.state.showInactive
        });
    }

    _selectTab(tab) {
        let account = this.state.userAccIds[tab];
        this.actions.savePreferredAccount(account);
        this.stores.kio
            .getApplications('', account)
            .filter(app => app.active)
            .filter(app => this.props.kioStore.getApplicationVersions(app.id) === false)
            .forEach(app => setTimeout(() => this.actions.fetchApplicationVersions(app.id), 50));
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
