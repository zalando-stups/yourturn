import React from 'react';
import {Link} from 'react-router';
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
                            to='application-appDetail'
                            params={LINK_PARAMS}>
                            {applicationId}
                        </Link> <span className='versionDetail-versionId'>{versionId}</span>
                    </h2>

                    <div className='btn-group'>
                        <Link
                            to='application-appDetail'
                            className='btn btn-default'
                            params={LINK_PARAMS}>
                            <i className='fa fa-chevron-left'></i> {applicationId} versions
                        </Link>
                        <Link
                            to='application-verEdit'
                            className='btn btn-default'
                            params={LINK_PARAMS}>
                            <i className='fa fa-edit'></i> Edit {versionId}
                        </Link>
                        <Link
                            to='application-verApproval'
                            className='btn btn-primary'
                            params={LINK_PARAMS}>
                            <i className='fa fa-check'></i> Approvals <span className='badge'>0</span>
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
VersionFormPlaceholder.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default VersionFormPlaceholder;