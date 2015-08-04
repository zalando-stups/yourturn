import React from 'react';
import Icon from 'react-fa';
import Timestamp from 'react-time';
import {DATE_FORMAT} from 'common/src/config';
import 'common/asset/less/application/oauth-sync-info.less';

const STATUS = {
    'NOT_ISSUED': 0,
    'PENDING': 1,
    'ISSUED': 2,
    'FAILED': 3
};

class OAuthSyncInfo extends React.Component {
    constructor() {
        super();
        this.state = {
            status: [STATUS.NOT_ISSUED, '']
        };
    }

    renewCredentials() {
        this.setState({
            status: [STATUS.PENDING, '']
        });

        this
        .props
        .onRenewCredentials()
        .then(() => this.setState({ status: [STATUS.ISSUED, '']}))
        .catch(e => this.setState({ status: [STATUS.FAILED, e]}));
    }

    render() {
        let {oauth} = this.props,
            {status} = this.state;
        return <div className='oauthSyncInfo'>
                    <table className='u-info'>
                        <colgroup>
                            <col width='0.5*' />
                            <col width='0.5*' />
                        </colgroup>
                        <tbody>
                            <tr>
                                <td>Last update of access configuration</td>
                                <td>{oauth.last_modified ?
                                        <Timestamp format={DATE_FORMAT} value={oauth.last_modified} /> :
                                        'unknown'}
                                </td>
                            </tr>
                            <tr>
                                <td>Last client rotation</td>
                                <td>{oauth.last_client_rotation ?
                                        <Timestamp format={DATE_FORMAT} value={oauth.last_client_rotation} /> :
                                        'unknown'}
                                </td>
                            </tr>
                            <tr>
                                <td>Last password rotation</td>
                                <td>{oauth.last_password_rotation ?
                                        <Timestamp format={DATE_FORMAT} value={oauth.last_password_rotation} /> :
                                        'unknown'}
                                </td>
                            </tr>
                            <tr>
                                <td>Last sync with IAM</td>
                                <td>{oauth.last_synced ?
                                        <Timestamp format={DATE_FORMAT} value={oauth.last_synced} /> :
                                        'unknown'}
                                </td>
                            </tr>
                            {this.props.onRenewCredentials === false ?
                                null
                                :
                                <tr>
                                    <td>
                                        <div className='btn-group'>
                                            {status[0] === STATUS.NOT_ISSUED ?
                                                <div className='btn btn-default'
                                                     onClick={this.renewCredentials.bind(this)}>
                                                    <Icon name='refresh' /> Renew credentials
                                                </div>
                                                :
                                                status[0] === STATUS.PENDING ?
                                                    <div className='btn btn-disabled'>
                                                        <Icon name='refresh' spin/> Queueing renewal…
                                                    </div>
                                                    :
                                                    status[0] === STATUS.ISSUED ?
                                                        <div className='btn btn-disabled'>
                                                            <Icon name='check' /> Renewal enqueued
                                                        </div>
                                                        :
                                                        <div className='btn btn-disabled'>
                                                            <Icon name='close' /> Renewal failed: {status[1].status} {status[1].message}
                                                        </div>
                                            }
                                        </div>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                    {oauth.has_problems ?
                        <p className='u-warning'>mint has problems syncing credentials. Please check that all configured S3 buckets exist and give write access to mint-worker.</p>
                        :
                        null}
                </div>;
    }
}
OAuthSyncInfo.displayName = 'OAuthSyncInfo';
OAuthSyncInfo.propTypes = {
    oauth: React.PropTypes.object.isRequired,
    onRenewCredentials: React.PropTypes.oneOfType([
                            React.PropTypes.func,
                            React.PropTypes.bool]).isRequired
};

export default OAuthSyncInfo;
