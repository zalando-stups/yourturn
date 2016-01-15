import React from 'react';
import Icon from 'react-fa';
import {Link} from 'react-router';
import * as Routes from 'application/src/routes';
import 'common/asset/less/application/version-detail.less';

class VersionFormPlaceholder extends React.Component {
    constructor() {
        super();
    }

    render() {
        let {applicationId, versionId} = this.props;
        const LINK_PARAMS = {
            applicationId: applicationId,
            versionId: versionId
        };
        return <div className='versionDetail u-placeholder'>
                    <h2>
                        <Link
                            to={Routes.appDetail(LINK_PARAMS)}>
                            {applicationId}
                        </Link> <span className='versionDetail-versionId'>{versionId}</span>
                    </h2>

                    <div className='btn-group'>
                        <Link
                            to={Routes.appDetail(LINK_PARAMS)}
                            className='btn btn-default'>
                            <Icon name='chevron-left' /> {applicationId} versions
                        </Link>
                        <Link
                            to={Routes.verEdit(LINK_PARAMS)}
                            className='btn btn-default'>
                            <Icon name='edit' /> Edit {versionId}
                        </Link>
                        <Link
                            to={Routes.verApproval(LINK_PARAMS)}
                            className='btn btn-primary'>
                            <Icon name='check' /> Approvals <span className='badge'>0</span>
                        </Link>
                    </div>

                    <table className='table'>
                        <tbody>
                            <tr>
                                <th>ID</th>
                                <td className='u-placeholder-text'>0.10.0</td>
                            </tr>
                            <tr>
                                <th>Last modified</th>
                                <td className='u-placeholder-text'>May 28th 2025</td>
                            </tr>
                            <tr>
                                <th>Artifact</th>
                                <td className='u-placeholder-text'>docker://whatever.io</td>
                            </tr>
                        </tbody>
                    </table>
                    <h4 className='versionDetail-notesTitle'>Notes</h4>
                    <p className='u-placeholder-text'>
                        These are some version notes.
                    </p>
                </div>;
    }
}
VersionFormPlaceholder.displayName = 'VersionFormPlaceholder';
VersionFormPlaceholder.propTypes = {
    applicationId: React.PropTypes.string.isRequired,
    versionId: React.PropTypes.string
};

export default VersionFormPlaceholder;