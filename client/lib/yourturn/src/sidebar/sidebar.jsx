import React from 'react';
import Timestamp from 'react-time';
import request from 'common/src/superagent';
import {Provider, RequestConfig, saveRoute} from 'common/src/oauth-provider';
import 'common/asset/less/yourturn/sidebar.less';

class Sidebar extends React.Component {
    constructor(props) {
        super();
        this.actions = props.flux.getActions('user');
    }

    login() {
        request
            .get('does.not.matter')
            .oauth(Provider, RequestConfig)
            .requestAccessToken(saveRoute);
    }

    refresh() {
        this.logout();
        this.login();
    }

    logout() {
        this.actions.deleteTokenInfo();
    }

    render() {
        let tokeninfo = this.props.flux.getStore('user').getTokenInfo();
        return  <aside className='sidebar'>
                    <div className='sidebar-content'>
                        <div className='header'>
                        {tokeninfo ?
                            <div>
                                <div className='userInfo'>
                                    <span className='userImage' />
                                    <span>{tokeninfo.uid}</span>
                                </div>
                                <div className='tokenInfo'>
                                    <div>
                                        <small>
                                            OAuth Token {tokeninfo.valid_until < Date.now() ? 'expired' : 'expires'} <Timestamp value={tokeninfo.valid_until} relative={true} />.
                                        </small>
                                    </div>
                                    <div className='btn-group'>
                                        <button
                                            onClick={this.refresh.bind(this)}
                                            className='btn btn-default'>
                                            <i className='fa fa-refresh'></i> Refresh
                                        </button>
                                        <button
                                            onClick={this.logout.bind(this)}
                                            className='btn btn-default'>
                                            <i className='fa fa-sign-out'></i> Logout
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
                                        <i className='fa fa-sign-in'></i> Log in
                                    </button>
                                </div>
                            </div>
                        }
                        </div>
                        <div className='sidebar-item' data-route='search'>
                            <a href='/search'>Search</a> <i className='fa fa-search'></i>
                        </div>
                        <div className='sidebar-item' data-route='application'>
                            <a href='/application'>Applications</a> <i className='fa fa-cubes'></i>
                        </div>
                        <div className='sidebar-item' data-route='resource'>
                            <a href='/resource'>Resource Types</a> <i className='fa fa-key'></i>
                        </div>
                    </div>
                </aside>;
    }
}

export default Sidebar;