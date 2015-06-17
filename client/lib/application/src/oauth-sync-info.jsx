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
        return <table className='oauthSyncInfo u-info'>
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
                </table>;
    }
}
OAuthSyncInfo.displayName = 'OAuthSyncInfo';
OAuthSyncInfo.propTypes = {
    oauth: React.PropTypes.object.isRequired
};

export default OAuthSyncInfo;