/* global ENV_TEST */
import React from 'react';
import Icon from 'react-fa';
import AccountList from './account-list.jsx';
import AccountAppList from './account-app-list.jsx';
import {Tabs, TabPanel, TabList, Tab} from 'react-tabs';
import {Link} from 'react-router';
import * as Routes from 'application/src/routes';
import _ from 'lodash';
import 'common/asset/less/application/application-list.less';
import 'common/asset/less/common/tabs.less';

class ApplicationList extends React.Component {
    constructor(props) {
        super();
        this.state = {
            term: '',
            showInactive: false,
            tabAccounts: props.tabAccounts,
            selectedTab: props.tabAccounts.indexOf(props.selectedTab) + 1 // first is management tab
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            selectedTab: nextProps.tabAccounts.indexOf(nextProps.selectedTab) + 1,
            tabAccounts: nextProps.tabAccounts
        });
    }

    filter(evt) {
        this.setState({
            term: evt.target.value
        });
    }

    toggleShowInactive() {
        this.setState({
            showInactive: !this.state.showInactive
        });
    }

    selectTab(tab) {
        if (tab > 0) {
            let account = this.state.tabAccounts[tab - 1];
            this.props.kioActions.savePreferredAccount(account);
            this.props.onChangeTab(account);
            return;
        }
        this.setState({selectedTab: tab})
    }

    updateAccounts(tabAccounts) {
        this.props.kioActions.saveTabAccounts(tabAccounts);
        this.setState({tabAccounts});
    }

    render() {
        let {term, showInactive, tabAccounts, selectedTab} = this.state,
            {applicationsFetching} = this.props;
        return <div className='applicationList'>
                    <h2 className='applicationList-headline'>Applications
                        {applicationsFetching !== false && applicationsFetching.isPending() ?
                            <Icon name='circle-o-notch u-spinner' spin /> :
                            null}
                    </h2>
                    <div className='btn-group'>
                        <Link
                            to={Routes.appCreate()}
                            className='btn btn-primary'>
                            <Icon name='plus' /> Create Application
                        </Link>
                    </div>
                    {!ENV_TEST ?
                        <Tabs
                            onSelect={this.selectTab.bind(this)}
                            selectedIndex={selectedTab}>
                            <TabList>
                                <Tab key='manage_tabs'><Icon name='plus' /></Tab>
                                {tabAccounts.map(acc => <Tab key={acc}>{acc}</Tab>)}
                            </TabList>
                            <TabPanel>
                                <AccountList
                                    onChange={this.updateAccounts.bind(this)}
                                    selected={tabAccounts}
                                    accounts={this.props.accounts.map(a => a.name)} />
                            </TabPanel>
                            {tabAccounts.map(acc => <TabPanel key={acc}>
                                                        <div className='form'>
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
                                                                       onChange={this.toggleShowInactive.bind(this)}>
                                                                </input> show inactive
                                                            </label>
                                                        </div>
                                                        <AccountAppList
                                                            account={acc}
                                                            search={term}
                                                            showInactive={showInactive}
                                                            kioStore={this.props.kioStore} />
                                                    </TabPanel>)}
                        </Tabs>
                        :
                        null
                    }
                </div>;
    }
}
ApplicationList.displayName = 'ApplicationList';

export default ApplicationList;
