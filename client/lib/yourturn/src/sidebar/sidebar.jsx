import React from 'react';
import {connect} from 'react-redux';
import Icon from 'react-fa';
import Gravatar from 'react-gravatar';
import * as AppRoutes from 'application/src/routes';
import * as ResRoutes from 'resource/src/routes';
import Timestamp from 'react-time';
import Badge from 'common/src/badge.jsx';
import Counter from 'common/src/counter.jsx';
import * as UserGetter from 'common/src/data/user/user-getter';
import * as UserActions from 'common/src/data/user/user-actions';
import * as FullstopGetter from 'common/src/data/fullstop/fullstop-getter';
import 'common/asset/less/yourturn/sidebar.less';

class Sidebar extends React.Component {
    constructor() {
        super();
        this.interval = false;
        this.state = {
            isTokenValid: true
        };
    }

    login() {
        this.props.dispatch(UserActions.fetchAccessToken());
    }

    refresh() {
        this.logout();
        this.login();
    }

    logout() {
        this.props.dispatch(UserActions.deleteTokenInfo());
    }

    updateExpiryDate() {
        let {tokenInfo} = this.props,
            NOW = Date.now();
        this.setState({
            currentDate: NOW, // to enforce state change
            isTokenValid: NOW < tokenInfo.valid_until
        });
    }

    componentDidMount() {
        this.interval = setInterval(this.updateExpiryDate.bind(this), 5000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    transition(route) {
        if (!this.props.activeRoute !== route) {
            this.context.router.push(route);
        }
    }

    render() {
        let {tokenInfo, userInfo, violationCount} = this.props;
        return <aside className='sidebar'>
                    <div className='sidebar-content'>
                        <div className='header'>
                        {tokenInfo.uid ?
                            <div>
                                {userInfo ?
                                    <div className='userInfo'>
                                            <Gravatar
                                                size={150}
                                                className='userImage'
                                                email={userInfo.email || ''}
                                                https={true} />
                                            <span>{userInfo.name || tokenInfo.uid}</span>
                                    </div>
                                    :
                                    <div className='userInfo'>
                                        <span>You are not logged in.</span>
                                    </div>}
                                <div className='tokenInfo'>
                                    <div>
                                        <small>
                                            OAuth Token {this.state.isTokenValid ? 'expires' : 'expired'} <Timestamp value={tokenInfo.valid_until} relative={true} />.
                                        </small>
                                    </div>
                                    <div className='btn-group'>
                                        <button
                                            onClick={this.refresh.bind(this)}
                                            className='btn btn-default'>
                                            <Icon fixedWidth name='refresh' /> Refresh
                                        </button>
                                        <button
                                            onClick={this.logout.bind(this)}
                                            className='btn btn-default'>
                                            <Icon fixedWidth name='sign-out' /> Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className='tokenInfo'>
                                <div>You are not logged in.</div>
                                <div className='btn-group'>
                                    <button
                                        onClick={this.login.bind(this)}
                                        className='btn btn-default'>
                                        <Icon name='sign-in' /> Log in
                                    </button>
                                </div>
                            </div>
                        }
                        </div>
                        <div
                            className='sidebar-item'
                            data-active={this.props.activeRoute === '/'}
                            onClick={this.transition.bind(this, '/')}>
                            <span className='sidebar-item-link'>
                                Search <Icon fixedWidth name='search' />
                            </span>
                        </div>
                        <div
                            className='sidebar-item'
                            data-active={this.props.activeRoute.startsWith(AppRoutes.appList())}
                            onClick={this.transition.bind(this, AppRoutes.appList())}>
                            <span className='sidebar-item-link'>
                                Applications <Icon fixedWidth name='cubes' />
                            </span>
                        </div>
                        <div
                            className='sidebar-item'
                            data-active={this.props.activeRoute.startsWith(ResRoutes.resList())}
                            onClick={this.transition.bind(this, ResRoutes.resList())}>
                            <span className='sidebar-item-link'>
                                Resource Types <Icon fixedWidth name='key' />
                            </span>
                        </div>
                        <div
                            className='sidebar-item'
                            data-active={this.props.activeRoute.startsWith('/violation')}
                            onClick={this.transition.bind(this, '/violation')}>
                            <span className='sidebar-item-link'>
                                Violations <Badge
                                                isDanger={true}>
                                                {violationCount ?
                                                    <Counter
                                                        begin={0}
                                                        time={1000}
                                                        end={violationCount}/>
                                                    :
                                                    0}
                                            </Badge> <Icon fixedWidth name='warning' />
                            </span>
                        </div>
                    </div>
                </aside>;
    }
}
Sidebar.displayName = 'Sidebar';
Sidebar.contextTypes = {
    router: React.PropTypes.object
};
export default connect(state => ({
    userInfo: UserGetter.getUserInfo(state.user),
    tokenInfo: UserGetter.getTokenInfo(state.user),
    violationCount: FullstopGetter.getOwnTotal(state.fullstop)
}))(Sidebar);
