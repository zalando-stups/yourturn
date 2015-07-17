import React from 'react';
import Timestamp from 'react-time';
import {DATE_FORMAT} from 'common/src/config';
import 'common/asset/less/application/oauth-sync-info.less';


class OAuthSyncInfo extends React.Component {
    constructor() {
        super();
    }

    render() {
        let {oauth} = this.props;
        return <div className='oauthSyncInfo'>
                    {oauth.has_problems ?
                        <p className='u-warning'>mint has problems syncing credentials. Please check that all configured S3 buckets exist and give write access to mint-worker.</p>
                        :
                        null}
                    <table className='u-info'>
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
                        </tbody>
                    </table>
                </div>;
    }
}
OAuthSyncInfo.displayName = 'OAuthSyncInfo';
OAuthSyncInfo.propTypes = {
    oauth: React.PropTypes.object.isRequired
};

export default OAuthSyncInfo;
